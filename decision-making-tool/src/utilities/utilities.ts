import {
  CENTER_X,
  CENTER_Y,
  CIRCLE_RADIUS_BIG,
  DOUBLE,
  FULL_CIRCLE,
  HALF,
  HALF_CIRCLE_DEGREES,
  NORMALIZED_VALUE,
  OPACITY,
  PASTEL_MIN,
  PASTEL_RANGE,
  TEXT_OFFSET,
} from "@/constants/canvas-constants.ts";
import type { OptionItemValue } from "@/types";
import { ZERO } from "@/constants/constants.ts";

export function calculateTextCoordinates(
  startAngle: number,
  endAngle: number,
): { textX: number; textY: number; textAngle: number } {
  const middleAngle = (startAngle + endAngle) / DOUBLE;
  const textRadius = CIRCLE_RADIUS_BIG * TEXT_OFFSET;
  const textX = CENTER_X + Math.cos(middleAngle) * textRadius;
  const textY = CENTER_Y + Math.sin(middleAngle) * textRadius;
  const textAngle = middleAngle + Math.PI / HALF;
  return { textX, textY, textAngle };
}

export function calculateAngle(weightSum: number, weight: number): number {
  return (FULL_CIRCLE / weightSum) * weight;
}

export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / HALF_CIRCLE_DEGREES);
}

export function getPastelValue(): number {
  return Math.floor(Math.random() * PASTEL_RANGE + PASTEL_MIN);
}

export function randomColor(): string {
  return `rgba(${getPastelValue()}, ${getPastelValue()}, ${getPastelValue()}, ${OPACITY})`;
}

export function calculateWeightSum(data: OptionItemValue[]): number {
  let accumulator = ZERO;
  for (const item of data) {
    const weight = Number(item.weight);
    accumulator += weight;
  }
  return accumulator;
}

export function easeInOutQuad(x: number): number {
  return x < HALF
    ? DOUBLE * x * x
    : NORMALIZED_VALUE - Math.pow(-DOUBLE * x + DOUBLE, DOUBLE) / DOUBLE;
}

export function getAbsoluteProgressAnimation(
  elapsedTime: number,
  duration: number,
): number {
  return NORMALIZED_VALUE - elapsedTime / duration;
}
