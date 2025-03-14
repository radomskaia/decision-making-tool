import {
  DEFAULT_DURATION,
  FULL_CIRCLE,
  HALF_CIRCLE_DEGREES,
  HALF,
  INITIAL_DEGREE,
  MILLISECONDS_IN_SECOND,
  MIN_ANGLE_FOR_TITLE,
  OPACITY,
  PASTEL_MIN,
  PASTEL_RANGE,
  MIN_TURNS_COUNT,
  DOUBLE,
  NORMALIZED_VALUE,
  MAX_PERCENTAGE,
  MIN_CURSOR_ANGLE,
  MAX_CURSOR_ANGLE,
} from "@/constants/canvas-constants.ts";
import type { OptionItemValue, SectorData, UpdateSector } from "@/types";
import { AudioName } from "@/types";
import { StorageKeys } from "@/types";
import { LocalStorage } from "@/services/local-storage.ts";
import { Validator } from "@/services/validator.ts";
import { ZERO } from "@/constants/constants.ts";
import type { Canvas } from "@/components/canvas/canvas.ts";
import { AudioElement } from "@/components/settings/audio-element.ts";
import type { BaseButton } from "@/components/buttons/base/base-button.ts";

export class Wheel {
  private sectorData: SectorData[] = [];
  private duration = DEFAULT_DURATION * MILLISECONDS_IN_SECOND;
  private startAngle = Wheel.degreesToRadians(INITIAL_DEGREE);
  private currentTitle: string | null = null;
  private startAnimation: number | null = null;
  private turnsCount = MIN_TURNS_COUNT;
  private audio = AudioElement.getInstance();
  private cursorAnimationDuration = MILLISECONDS_IN_SECOND;
  private cursorAnimationStartTimestamp = ZERO;
  private cursorBounceAngle = Wheel.degreesToRadians(MIN_CURSOR_ANGLE);
  private lastSectorTimestamp = ZERO;
  private isRotate = false;
  private cursorAngle = ZERO;

  constructor(
    private canvas: Canvas,
    private textElement: HTMLParagraphElement,
  ) {
    this.canvas = canvas;
    this.textElement = textElement;
    this.loadData();
  }

  private static calculateAngle(weightSum: number, weight: number): number {
    return (FULL_CIRCLE / weightSum) * weight;
  }

  private static degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / HALF_CIRCLE_DEGREES);
  }

  private static getPastelValue(): number {
    return Math.floor(Math.random() * PASTEL_RANGE + PASTEL_MIN);
  }

  private static randomColor(): string {
    return `rgba(${Wheel.getPastelValue()}, ${Wheel.getPastelValue()}, ${Wheel.getPastelValue()}, ${OPACITY})`;
  }

  private static calculateWeightSum(data: OptionItemValue[]): number {
    let accumulator = ZERO;
    for (const item of data) {
      const weight = Number(item.weight);
      accumulator += weight;
    }
    return accumulator;
  }

  private static easeInOutQuad(x: number): number {
    return x < HALF
      ? DOUBLE * x * x
      : NORMALIZED_VALUE - Math.pow(-DOUBLE * x + DOUBLE, DOUBLE) / DOUBLE;
  }

  public setDuration(duration: number): void {
    this.duration = duration * MILLISECONDS_IN_SECOND;
  }

  public isSectorData(): boolean {
    return this.sectorData.length > ZERO;
  }

  public animate(startButton: BaseButton): void {
    const now = Date.now();
    if (!this.startAnimation) {
      this.startAnimation = now;
      this.lastSectorTimestamp = now;
    }
    const elapsedTime = now - this.startAnimation;
    if (elapsedTime > this.duration && !this.isRotate) {
      this.endAnimation(startButton);
      return;
    }

    const offsetAngle = this.getOffsetAngle(elapsedTime);
    let cursorAngle = this.cursorAngle;
    if (this.isRotate) {
      cursorAngle = this.animateCursor();
    }
    this.canvas.drawSectors(this.sectorData, {
      offset: offsetAngle,
      updateSector: this.updateCurrentSector.bind(this),
      angle: cursorAngle,
    });
    requestAnimationFrame(() => this.animate(startButton));
  }

  private getAbsoluteProgressAnimation(elapsedTime: number): number {
    return NORMALIZED_VALUE - elapsedTime / this.duration;
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
    const elapsedTime = now - this.lastSectorTimestamp;
    const maxSpeed = this.cursorAnimationDuration / DOUBLE;
    const speedFactor = Math.max(ZERO, (maxSpeed - elapsedTime) / maxSpeed);

    return Wheel.degreesToRadians(
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
      const now = Date.now();
      if (this.isRotate) {
        this.cursorAngle -=
          Math.floor(this.cursorAngle / FULL_CIRCLE) * FULL_CIRCLE;
      }
      this.isRotate = true;
      this.cursorAnimationStartTimestamp = now;
      this.lastSectorTimestamp = now;
      this.audio.stopAudio(AudioName.strike);
      this.audio.playAudio(AudioName.strike);
      this.currentTitle = title;
      this.textElement.textContent = title;
    }
  };

  private getOffsetAngle(elapsedTime: number): number {
    const progress = this.getAbsoluteProgressAnimation(elapsedTime);
    return (
      ((this.turnsCount * FULL_CIRCLE +
        Math.floor(Math.random() * FULL_CIRCLE)) /
        MAX_PERCENTAGE) *
      Wheel.easeInOutQuad(progress)
    );
  }

  private endAnimation(startButton: BaseButton): void {
    this.audio.playAudio(AudioName.end);
    this.startAnimation = null;
    this.turnsCount = MIN_TURNS_COUNT;
    startButton.buttonDisabled(false);
    this.audio.getButton().buttonDisabled(false);
  }

  private loadData(): void {
    const lsData = LocalStorage.getInstance().load(
      StorageKeys.optionListValue,
      Validator.getInstance().isOptionListValue.bind(Validator.getInstance()),
    );
    if (!lsData) {
      return;
    }
    const data = lsData.list.filter((element) =>
      Validator.isValidOption(element),
    );
    if (!Validator.hasMinimumOptions(data)) {
      return;
    }
    const sortedData = [...data].sort(() => Math.random() - HALF);
    this.prepare(sortedData);
    this.canvas.drawSectors(this.sectorData);
  }

  private prepare(data: OptionItemValue[]): void {
    const weightSum = Wheel.calculateWeightSum(data);
    let startAngle = this.startAngle;
    for (const { weight, title } of data) {
      const angle = Wheel.calculateAngle(weightSum, Number(weight));
      const color = Wheel.randomColor();
      const sectorData: SectorData = {
        startAngle: startAngle,
        angle: angle,
        color: color,
        title: title,
        isTitle: angle > MIN_ANGLE_FOR_TITLE,
      };
      startAngle += angle;
      this.sectorData.push(sectorData);
    }
  }
}
