import { BaseComponent } from "@/components/base-component.ts";
import {
  CANVAS_SIZE,
  CIRCLE_CENTER,
  CIRCLE_RADIUS_BIG,
  CIRCLE_RADIUS_SMALL,
  DIVIDER,
  END_ANGLE,
  FULL_CIRCLE,
  HALF_CIRCLE_DEGREES,
  INITIAL_DEGREE,
  ORIGIN_COORDINATE,
  PASTEL_MIN,
  PASTEL_RANGE,
  HALF_OFFSET,
  START_ANGLE,
  STROKE_COLOR,
  FONT_SIZE,
  MIN_ANGLE_FOR_TITLE,
  MAX_TEXT_WIDTH,
  TEXT_OFFSET,
} from "@/constants/canvas-constants.ts";
import type { OptionItemValue } from "@/types";
import { FIRST_INDEX, LAST_INDEX } from "@/constants/constants.ts";

export class Canvas extends BaseComponent<"canvas"> {
  private context: CanvasRenderingContext2D;
  constructor() {
    super();
    this.context = this.getContext();
    this.drawCircle(CIRCLE_RADIUS_BIG);
    this.drawClip();
  }

  private static calculateAngle(weightSum: number, weight: number): number {
    return (FULL_CIRCLE / weightSum) * weight;
  }

  private static getPastelValue(): number {
    return Math.floor(Math.random() * PASTEL_RANGE + PASTEL_MIN);
  }

  // private static radiansToDegrees(radians: number): number {
  //   return radians * (HALF_CIRCLE_DEGREES / Math.PI);
  // }

  private static calculateTextCoordinates(
    startAngle: number,
    endAngle: number,
  ): { textX: number; textY: number; textAngle: number } {
    const middleAngle = (startAngle + endAngle) / DIVIDER;
    const textRadius = CIRCLE_RADIUS_BIG * TEXT_OFFSET;
    const textX = CIRCLE_CENTER + Math.cos(middleAngle) * textRadius;
    const textY = CIRCLE_CENTER + Math.sin(middleAngle) * textRadius;
    const textAngle = middleAngle + Math.PI / HALF_OFFSET;
    return { textX, textY, textAngle };
  }

  private static degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / HALF_CIRCLE_DEGREES);
  }

  private static randomColor(): string {
    return `rgba(${Canvas.getPastelValue()}, ${Canvas.getPastelValue()}, ${Canvas.getPastelValue()}, 0.5)`;
  }

  public drawSectors(weightSum: number, data: OptionItemValue[]): void {
    this.context.clearRect(
      ORIGIN_COORDINATE,
      ORIGIN_COORDINATE,
      CANVAS_SIZE,
      CANVAS_SIZE,
    );
    const shuffledData = [...data].sort(() => Math.random() - HALF_OFFSET);
    let startAngle = Canvas.degreesToRadians(INITIAL_DEGREE);
    for (const { weight, title } of shuffledData) {
      const angle = Canvas.calculateAngle(weightSum, Number(weight));
      const endAngle = startAngle + angle;
      this.drawSector(startAngle, endAngle);
      if (angle > MIN_ANGLE_FOR_TITLE) {
        const { textX, textY, textAngle } = Canvas.calculateTextCoordinates(
          startAngle,
          endAngle,
        );
        this.drawText(title, textX, textY, textAngle);
      }
      startAngle += angle;
    }
    this.drawCircle(CIRCLE_RADIUS_SMALL);
  }

  public drawCircle(radius: number): void {
    const { context } = this;
    if (radius === CIRCLE_RADIUS_SMALL) {
      context.lineWidth++;
    }
    context.beginPath();
    context.arc(
      CIRCLE_CENTER,
      CIRCLE_CENTER,
      radius,
      START_ANGLE,
      END_ANGLE,
      true,
    );
    context.closePath();
    context.strokeStyle = STROKE_COLOR;
    context.stroke();
    if (radius === CIRCLE_RADIUS_SMALL) {
      context.lineWidth--;
    }
  }

  protected createView(): HTMLElementTagNameMap["canvas"] {
    return this.createDOMElement({
      tagName: "canvas",
      attributes: {
        width: CANVAS_SIZE.toString(),
        height: CANVAS_SIZE.toString(),
      },
    });
  }

  private drawClip(): void {
    const { context } = this;
    context.beginPath();
    context.rect(
      ORIGIN_COORDINATE,
      ORIGIN_COORDINATE,
      CANVAS_SIZE,
      CANVAS_SIZE,
    );
    context.arc(
      CIRCLE_CENTER,
      CIRCLE_CENTER,
      CIRCLE_RADIUS_SMALL,
      START_ANGLE,
      END_ANGLE,
      true,
    );
    context.clip();
  }

  private getContext(): CanvasRenderingContext2D {
    const context = this.element.getContext("2d");
    if (!context) {
      throw new Error("Failed to get context");
    }
    return context;
  }

  private drawSector(startAngle: number, endAngle: number): void {
    const { context } = this;
    context.beginPath();
    context.arc(
      CIRCLE_CENTER,
      CIRCLE_CENTER,
      CIRCLE_RADIUS_BIG,
      startAngle,
      endAngle,
    );
    context.lineTo(CIRCLE_CENTER, CIRCLE_CENTER);
    context.closePath();
    context.fillStyle = Canvas.randomColor();
    context.strokeStyle = STROKE_COLOR;
    context.fill();
    context.stroke();
  }

  private truncateText(text: string): string {
    const { context } = this;
    let truncatedText = text;
    const ellipsis = "...";
    let textWidth = context.measureText(truncatedText).width;
    if (textWidth > MAX_TEXT_WIDTH) {
      let renderText = truncatedText + ellipsis;
      while (textWidth > MAX_TEXT_WIDTH) {
        truncatedText = truncatedText.slice(FIRST_INDEX, LAST_INDEX);
        renderText = truncatedText + ellipsis;
        textWidth = context.measureText(renderText).width;
      }
      truncatedText += ellipsis;
    }
    return truncatedText;
  }

  private drawText(text: string, x: number, y: number, angle: number): void {
    const { context } = this;
    const truncatedText = this.truncateText(text);
    context.save();
    context.translate(x, y);
    context.rotate(angle);
    context.font = `${FONT_SIZE}px inter, sans-serif`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = STROKE_COLOR;
    context.fillText(truncatedText, ORIGIN_COORDINATE, ORIGIN_COORDINATE);
    context.restore();
  }
}
