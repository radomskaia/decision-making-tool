import {
  DEFAULT_DURATION,
  FULL_CIRCLE,
  HALF,
  INITIAL_DEGREE,
  MILLISECONDS_IN_SECOND,
  MIN_ANGLE_FOR_TITLE,
  MIN_TURNS_COUNT,
  DOUBLE,
  NORMALIZED_VALUE,
  MAX_PERCENTAGE,
  MIN_CURSOR_ANGLE,
  MAX_CURSOR_ANGLE,
} from "@/constants/canvas-constants.ts";
import type {
  ToggleViewState,
  DrawSectors,
  SectorData,
  UpdateSector,
  WheelColors,
} from "@/types";
import { AudioName } from "@/types";
import { ZERO } from "@/constants/constants.ts";
import { AudioService } from "@/components/settings/audio-service.ts";
import {
  calculateAngle,
  calculateWeightSum,
  degreesToRadians,
  easeInOutQuad,
  getAbsoluteProgressAnimation,
  getColorString,
  getOppositeShade,
  getRGB,
} from "@/utilities/utilities.ts";
import { FileHandler } from "@/services/file-handler.ts";
import { ThemeService } from "@/components/settings/theme-service.ts";

export class Wheel {
  private sectorData: SectorData[] = [];
  private duration = DEFAULT_DURATION * MILLISECONDS_IN_SECOND;
  private startAngle = degreesToRadians(INITIAL_DEGREE);
  private currentTitle: string | null = null;
  private startAnimation: number | null = null;
  private turnsCount = MIN_TURNS_COUNT;
  private audio = AudioService.getInstance();
  private cursorAnimationDuration = MILLISECONDS_IN_SECOND;
  private cursorAnimationStartTimestamp = ZERO;
  private cursorBounceAngle = degreesToRadians(MIN_CURSOR_ANGLE);
  private isRotate = false;
  private cursorAngle = ZERO;
  private colors: WheelColors;

  constructor(
    private readonly drawSectors: DrawSectors,
    private titleSection: HTMLParagraphElement,
  ) {
    const themeToggle = ThemeService.getInstance();
    themeToggle.addListener(this.changeWheelColors.bind(this));
    this.colors = themeToggle.getColors();
    this.drawSectors = drawSectors;
    this.titleSection = titleSection;
    this.init();
    this.drawSectors(this.sectorData, {
      cursor: this.colors.cursor,
      stroke: this.colors.stroke,
    });
  }

  public setDuration(duration: number): void {
    this.duration = duration * MILLISECONDS_IN_SECOND;
  }

  public isSectorData(): boolean {
    return this.sectorData.length > ZERO;
  }

  public animateWheel(toggleViewState: ToggleViewState): void {
    const now = Date.now();
    if (!this.startAnimation) {
      this.startAnimation = now;
    }
    const elapsedTime = now - this.startAnimation;
    if (elapsedTime > this.duration && !this.isRotate) {
      this.endWheelAnimation(toggleViewState);
      return;
    }

    const offsetAngle = this.getOffsetAngle(elapsedTime);
    let cursorAngle = this.cursorAngle;
    if (this.isRotate) {
      cursorAngle = this.animateCursor();
    }
    this.drawSectors(
      this.sectorData,
      { cursor: this.colors.cursor, stroke: this.colors.stroke },
      {
        offset: offsetAngle,
        updateSector: this.updateCurrentSector.bind(this),
        angle: cursorAngle,
      },
    );
    requestAnimationFrame(() => this.animateWheel(toggleViewState));
  }

  private changeWheelColors(colors: WheelColors): void {
    this.colors = colors;
    for (const sector of this.sectorData) {
      const newRgbArray: number[] = [];
      for (const color of sector.rgbArray) {
        newRgbArray.push(getOppositeShade(color));
      }
      sector.rgbArray = newRgbArray;
      sector.color = getColorString(newRgbArray);
    }

    this.drawSectors(this.sectorData, {
      cursor: this.colors.cursor,
      stroke: this.colors.stroke,
    });
  }

  private animateCursor(): number {
    const now = Date.now();
    const initialAngle = this.cursorAngle;
    const elapsedTime = now - this.cursorAnimationStartTimestamp;
    let progress = elapsedTime / this.cursorAnimationDuration;
    let bounce: number;
    this.cursorBounceAngle = this.calculateCursorAngle(now);

    if (progress <= HALF) {
      progress *= DOUBLE;
      bounce = Math.sin(progress * Math.PI) * -this.cursorBounceAngle;
    } else {
      progress *= DOUBLE;
      bounce =
        NORMALIZED_VALUE -
        Math.sin(progress * Math.PI) * this.cursorBounceAngle;
    }

    this.cursorAngle = initialAngle - bounce;
    if (progress >= NORMALIZED_VALUE) {
      this.isRotate = false;
      this.cursorAngle = ZERO;
      return ZERO;
    }
    return bounce;
  }

  private calculateCursorAngle(now: number): number {
    const elapsedTime = now - this.cursorAnimationStartTimestamp;
    const maxSpeed = this.cursorAnimationDuration / DOUBLE;
    const speedFactor = Math.max(ZERO, (maxSpeed - elapsedTime) / maxSpeed);

    return degreesToRadians(
      MIN_CURSOR_ANGLE + speedFactor * (MAX_CURSOR_ANGLE - MIN_CURSOR_ANGLE),
    );
  }

  private updateCurrentSector: UpdateSector = (startAngle, angle, title) => {
    const mainAngle = this.startAngle + FULL_CIRCLE;
    if (
      startAngle <= mainAngle &&
      startAngle >= mainAngle - angle &&
      title !== this.currentTitle
    ) {
      if (this.isRotate) {
        this.cursorAngle -=
          Math.floor(this.cursorAngle / FULL_CIRCLE) * FULL_CIRCLE;
      }
      this.isRotate = true;
      this.cursorAnimationStartTimestamp = Date.now();
      this.audio.stopAudio(AudioName.strike);
      this.audio.playAudio(AudioName.strike);
      this.currentTitle = title;
      this.titleSection.textContent = title;
    }
  };

  private getOffsetAngle(elapsedTime: number): number {
    const progress = getAbsoluteProgressAnimation(elapsedTime, this.duration);
    return (
      ((this.turnsCount * FULL_CIRCLE +
        Math.floor(Math.random() * FULL_CIRCLE)) /
        MAX_PERCENTAGE) *
      easeInOutQuad(progress)
    );
  }

  private endWheelAnimation(toggleViewState: ToggleViewState): void {
    this.audio.playAudio(AudioName.end);
    this.startAnimation = null;
    this.turnsCount = MIN_TURNS_COUNT;
    toggleViewState(true);
    this.audio.getButton().disabledElement(false);
  }

  private init(): void {
    const data = FileHandler.getInstance().loadLSData();
    if (!data) {
      return;
    }
    const weightSum = calculateWeightSum(data);
    let startAngle = this.startAngle;
    for (const { weight, title } of data) {
      const angle = calculateAngle(weightSum, Number(weight));
      const rgbArray = getRGB(this.colors.thinner);
      const color = getColorString(rgbArray);
      const sectorData: SectorData = {
        startAngle: startAngle,
        angle: angle,
        color: color,
        rgbArray: rgbArray,
        title: title,
        isTitle: angle > MIN_ANGLE_FOR_TITLE,
      };
      startAngle += angle;
      this.sectorData.push(sectorData);
    }
  }
}
