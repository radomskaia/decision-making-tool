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
  COLOR_MAX,
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

export function getColorValue(thinner: number): number {
  return Math.floor((Math.random() * COLOR_MAX + thinner) / DOUBLE);
}

export function getOppositeShade(color: number): number {
  const oldColor = color * DOUBLE;
  return oldColor > COLOR_MAX
    ? (oldColor - COLOR_MAX) / DOUBLE
    : (oldColor + COLOR_MAX) / DOUBLE;
}

export function getRGB(thinner: number): number[] {
  const result: number[] = [];
  const rgb = "RGB";
  for (let index = ZERO; index < rgb.length; index++) {
    result.push(getColorValue(thinner));
  }
  return result;
}

export function getColorString(rgbArray: number[]): string {
  return `rgba(${rgbArray.join(",")}, ${OPACITY})`;
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
