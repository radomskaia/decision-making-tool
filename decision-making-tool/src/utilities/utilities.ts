import { CIRCLE, COLOR, TEXT } from "@/constants/wheel-constants.ts";
import type { Callback, OptionItemValue } from "@/types";
import {
  DELAY_TIME,
  DOUBLE,
  HALF,
  ONE,
  SYMBOLS,
  ZERO,
} from "@/constants/constants.ts";

export function calculateTextCoordinates(
  startAngle: number,
  endAngle: number,
): { textX: number; textY: number; textAngle: number } {
  const middleAngle = (startAngle + endAngle) / DOUBLE;
  const textRadius = CIRCLE.RADIUS.BIG * TEXT.OFFSET;
  const textX = CIRCLE.CENTER.X + Math.cos(middleAngle) * textRadius;
  const textY = CIRCLE.CENTER.Y + Math.sin(middleAngle) * textRadius;
  const textAngle = middleAngle + Math.PI / HALF;
  return { textX, textY, textAngle };
}

export function calculateAngle(weightSum: number, weight: number): number {
  return (CIRCLE.FULL_RADIAN / weightSum) * weight;
}

export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / CIRCLE.HALF_DEGREE);
}

export function getColorValue(thinner: number): number {
  return Math.floor((Math.random() * COLOR.RGB_MAX + thinner) / DOUBLE);
}

export function getOppositeShade(color: number): number {
  const oldColor = color * DOUBLE;
  return oldColor > COLOR.RGB_MAX
    ? (oldColor - COLOR.RGB_MAX) / DOUBLE
    : (oldColor + COLOR.RGB_MAX) / DOUBLE;
}

export function getRGB(thinner: number): number[] {
  const result: number[] = [];
  const rgb = COLOR.TYPE;
  for (let index = ZERO; index < rgb.length; index++) {
    result.push(getColorValue(thinner));
  }
  return result;
}

export function getColorString(rgbArray: number[]): string {
  return `rgb(${rgbArray.join(SYMBOLS.comma)},${COLOR.OPACITY})`;
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
    : ONE - Math.pow(-DOUBLE * x + DOUBLE, DOUBLE) / DOUBLE;
}

export function getAbsoluteProgressAnimation(
  elapsedTime: number,
  duration: number,
): number {
  return ONE - elapsedTime / duration;
}

export function debounce(callback: Callback, delay: number = DELAY_TIME) {
  let timeoutID: ReturnType<typeof setTimeout>;
  return function (): void {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => callback(), delay);
  };
}

export function checkBottom(): boolean {
  const scrollBottom = document.body.scrollHeight - window.innerHeight;
  return scrollBottom >= window.scrollY;
}
