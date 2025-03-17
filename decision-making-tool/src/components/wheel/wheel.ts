import {
  CIRCLE,
  MILLISECONDS_IN_SECOND,
  NORMALIZED_VALUE,
  MAX_PERCENTAGE,
  CURSOR,
  TEXT,
  DEFAULT_SETTINGS,
} from "@/constants/wheel-constants.ts";
import type {
  ToggleViewState,
  DrawSectors,
  SectorData,
  UpdateSector,
  WheelColors,
} from "@/types";
import { AudioName } from "@/types";
import {
  DOUBLE,
  EMPTY_STRING,
  HALF,
  PAGE_PATH,
  ZERO,
} from "@/constants/constants.ts";
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
import { Router } from "@/services/router.ts";

export class Wheel {
  private sectorData: SectorData[] = [];
  private duration = DEFAULT_SETTINGS.DURATION * MILLISECONDS_IN_SECOND;
  private startAngle = degreesToRadians(CIRCLE.INITIAL_DEGREE);
  private currentTitle: string | null = null;
  private currentTitleColor: string = EMPTY_STRING;
  private startAnimation: number | null = null;
  private turnsCount = DEFAULT_SETTINGS.TURNS_COUNT;
  private audio = AudioService.getInstance();
  private cursorAnimationDuration = MILLISECONDS_IN_SECOND;
  private cursorAnimationStartTimestamp = ZERO;
  private cursorBounceAngle = degreesToRadians(CURSOR.ANGLE.MIN);
  private isRotate = false;
  private cursorAngle = ZERO;
  private colors: WheelColors;

  constructor(
    private readonly drawSectors: DrawSectors,
    private titleSection: HTMLParagraphElement,
    private toggleViewState: ToggleViewState,
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
    this.toggleViewState = toggleViewState;
  }

  public setDuration(duration: number): void {
    this.duration = duration * MILLISECONDS_IN_SECOND;
  }

  public isSectorData(): boolean {
    return this.sectorData.length > ZERO;
  }

  public animateWheel(): void {
    if (Router.getInstance().getCurrentRoute() !== PAGE_PATH.DECISION_PICKER) {
      return;
    }
    const now = Date.now();
    if (!this.startAnimation) {
      this.startAnimation = now;
    }
    const elapsedTime = now - this.startAnimation;
    if (elapsedTime > this.duration && !this.isRotate) {
      this.endWheelAnimation();
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
    requestAnimationFrame(() => this.animateWheel());
  }

  private changeWheelColors(colors: WheelColors): void {
    this.colors = colors;
    for (const sector of this.sectorData) {
      const newRgbArray: number[] = [];
      for (const color of sector.rgbArray) {
        newRgbArray.push(getOppositeShade(color));
      }
      sector.rgbArray = newRgbArray;
      const newColor = getColorString(newRgbArray);
      if (this.currentTitleColor === sector.color) {
        this.currentTitleColor = newColor;
        this.toggleViewState(true, newColor);
      }
      sector.color = newColor;
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
      CURSOR.ANGLE.MIN + speedFactor * (CURSOR.ANGLE.MAX - CURSOR.ANGLE.MIN),
    );
  }

  private updateCurrentSector: UpdateSector = (
    startAngle,
    angle,
    title,
    color,
  ) => {
    const mainAngle = this.startAngle + CIRCLE.FULL_RADIAN;
    if (
      startAngle <= mainAngle &&
      startAngle >= mainAngle - angle &&
      title !== this.currentTitle
    ) {
      if (this.isRotate) {
        this.cursorAngle -=
          Math.floor(this.cursorAngle / CIRCLE.FULL_RADIAN) *
          CIRCLE.FULL_RADIAN;
      }
      this.isRotate = true;
      this.cursorAnimationStartTimestamp = Date.now();
      this.audio.stopAudio(AudioName.strike);
      this.audio.playAudio(AudioName.strike);
      this.currentTitle = title;
      this.currentTitleColor = color;
      this.titleSection.textContent = title;
    }
  };

  private getOffsetAngle(elapsedTime: number): number {
    const progress = getAbsoluteProgressAnimation(elapsedTime, this.duration);
    return (
      ((this.turnsCount * CIRCLE.FULL_RADIAN +
        Math.floor(Math.random() * CIRCLE.FULL_RADIAN)) /
        MAX_PERCENTAGE) *
      easeInOutQuad(progress)
    );
  }

  private endWheelAnimation(): void {
    this.audio.playAudio(AudioName.end);
    this.startAnimation = null;
    this.turnsCount = DEFAULT_SETTINGS.TURNS_COUNT;
    this.toggleViewState(true, this.currentTitleColor);
    this.audio.onEnded(AudioName.end, () => {
      this.audio.getButton().disabledElement(false);
    });
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
        isTitle: angle > TEXT.MIN_ANGLE,
      };
      startAngle += angle;
      this.sectorData.push(sectorData);
    }
  }
}
