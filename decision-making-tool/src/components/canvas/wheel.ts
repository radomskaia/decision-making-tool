import {
  FULL_CIRCLE,
  HALF_CIRCLE_DEGREES,
  HALF_OFFSET,
  INITIAL_DEGREE,
  MIN_ANGLE_FOR_TITLE,
  OPACITY,
  PASTEL_MIN,
  PASTEL_RANGE,
} from "@/constants/canvas-constants.ts";
import type { OptionItemValue, SectorData } from "@/types";
import { StorageKeys } from "@/types";
import { LocalStorage } from "@/services/local-storage.ts";
import { Validator } from "@/services/validator.ts";
import {
  MIN_POSITIVE_NUMBER,
  MINIMUM_OPTIONS_COUNT,
} from "@/constants/constants.ts";
import type { Canvas } from "@/components/canvas/canvas.ts";

export class Wheel {
  private sectorData: SectorData[] = [];
  constructor(private canvas: Canvas) {
    this.canvas = canvas;
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
    let accumulator = MIN_POSITIVE_NUMBER;
    for (const item of data) {
      const weight = Number(item.weight);
      accumulator += weight;
    }
    return accumulator;
  }

  public isSectorData(): boolean {
    return this.sectorData.length > MIN_POSITIVE_NUMBER;
  }

  private loadData(): void {
    const lsData = LocalStorage.getInstance().load(
      StorageKeys.optionListValue,
      Validator.getInstance().isOptionListValue.bind(Validator.getInstance()),
    );
    const data = lsData?.list.filter(
      (item) => item.title.trim() && Number(item.weight) > MIN_POSITIVE_NUMBER,
    );
    if (!data || data.length < MINIMUM_OPTIONS_COUNT) {
      return;
    }
    const sortedData = [...data].sort(() => Math.random() - HALF_OFFSET);
    this.prepare(sortedData);
    this.canvas.drawSectors(this.sectorData);
  }

  private prepare(data: OptionItemValue[]): void {
    const weightSum = Wheel.calculateWeightSum(data);
    let startAngle = Wheel.degreesToRadians(INITIAL_DEGREE);
    for (const { weight, title } of data) {
      const angle = Wheel.calculateAngle(weightSum, Number(weight));
      const endAngle = startAngle + angle;
      const color = Wheel.randomColor();
      const sectorData: SectorData = {
        startAngle: startAngle,
        endAngle: endAngle,
        color: color,
      };
      if (angle > MIN_ANGLE_FOR_TITLE) {
        sectorData.title = title;
      }
      startAngle += angle;
      this.sectorData.push(sectorData);
    }
  }
}
