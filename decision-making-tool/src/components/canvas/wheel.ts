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
} from "@/constants/canvas-constants.ts";
import type { OptionItemValue, SectorData, UpdateSector } from "@/types";
import { StorageKeys } from "@/types";
import { LocalStorage } from "@/services/local-storage.ts";
import { Validator } from "@/services/validator.ts";
import { ZERO } from "@/constants/constants.ts";
import type { Canvas } from "@/components/canvas/canvas.ts";

export class Wheel {
  private sectorData: SectorData[] = [];
  private duration = DEFAULT_DURATION;
  private startAngle = Wheel.degreesToRadians(INITIAL_DEGREE);
  private currentTitle: string | null = null;
  private startAnimation: Date | null = null;
  private sectionCount = ZERO;
  private turnsCount = MIN_TURNS_COUNT;

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
    this.duration = duration;
  }

  public isSectorData(): boolean {
    return this.sectorData.length > ZERO;
  }

  public animate(): void {
    if (!this.startAnimation) {
      this.startAnimation = new Date();
    }
    const now = new Date();
    const elapsedTime = now.getTime() - this.startAnimation.getTime();
    if (elapsedTime > this.duration * MILLISECONDS_IN_SECOND) {
      this.endAnimation();
      return;
    }

    const offsetAngle = this.getOffsetAngle(elapsedTime);

    this.canvas.drawSectors(
      this.sectorData,
      offsetAngle,
      this.updateCurrentSector.bind(this),
    );
    requestAnimationFrame(() => this.animate());
  }

  private getAbsoluteProgressAnimation(elapsedTime: number): number {
    return (
      NORMALIZED_VALUE - elapsedTime / (this.duration * MILLISECONDS_IN_SECOND)
    );
  }

  private getOffsetAngle(elapsedTime: number): number {
    const progress = this.getAbsoluteProgressAnimation(elapsedTime);
    return (
      ((this.turnsCount * FULL_CIRCLE) / MAX_PERCENTAGE) *
      Wheel.easeInOutQuad(progress)
    );
  }

  private endAnimation(): void {
    this.startAnimation = null;
    const roundCount = Math.floor(this.startAngle / FULL_CIRCLE);
    this.turnsCount = MIN_TURNS_COUNT;
    const offset = roundCount * FULL_CIRCLE;
    this.startAngle = this.startAngle - offset;
    this.sectorData = this.sectorData.map((sector) => {
      sector.startAngle -= offset;
      return sector;
    });
  }

  private updateCurrentSector: UpdateSector = (startAngle, angle, title) => {
    const mainAngle = this.startAngle + FULL_CIRCLE;
    if (
      startAngle <= mainAngle &&
      startAngle >= mainAngle - angle &&
      title !== this.currentTitle
    ) {
      this.sectionCount--;
      this.currentTitle = title;
      this.textElement.textContent = title || "Empty";
      if (this.sectionCount === ZERO) {
        this.startAngle += FULL_CIRCLE;
        this.sectionCount = this.sectorData.length;
      }
    }
  };

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
    this.sectionCount = this.sectorData.length;
  }
}
