import { BaseComponent } from "@/components/base-component.ts";
import {
  CANVAS_SIZE,
  CIRCLE_CENTER,
  CIRCLE_RADIUS_BIG,
  CIRCLE_RADIUS_SMALL,
  FULL_CIRCLE,
  PASTEL_MIN,
  PASTEL_RANGE,
  START_ANGLE,
} from "@/constants/canvas-constants.ts";
import type { OptionItemValue } from "@/types";

export class Canvas extends BaseComponent<"canvas"> {
  private context: CanvasRenderingContext2D;
  constructor() {
    super();
    this.context = this.getContext();
    this.drawCircle(CIRCLE_RADIUS_BIG);
  }

  private static calculateAngle(weightSum: number, weight: number): number {
    return (FULL_CIRCLE / weightSum) * weight;
  }

  private static getPastelValue(): number {
    return Math.floor(Math.random() * PASTEL_RANGE + PASTEL_MIN);
  }

  private static randomColor(): string {
    return `rgb(${Canvas.getPastelValue()}, ${Canvas.getPastelValue()}, ${Canvas.getPastelValue()})`;
  }

  public drawSectors(weightSum: number, data: OptionItemValue[]): void {
    let startAngle = START_ANGLE;
    for (const { weight } of data) {
      const angle = Canvas.calculateAngle(weightSum, Number(weight));
      this.drawSector(startAngle, startAngle + angle);
      startAngle += angle;
    }
    this.drawCircle(CIRCLE_RADIUS_SMALL);
  }

  public drawCircle(radius: number): void {
    const { context } = this;
    context.globalCompositeOperation = "destination-out";
    context.beginPath();
    context.arc(
      CIRCLE_CENTER,
      CIRCLE_CENTER,
      radius,
      START_ANGLE,
      FULL_CIRCLE,
      true,
    );
    context.closePath();
    context.strokeStyle = "black";
    context.stroke();
    context.fill();
    context.globalCompositeOperation = "source-over";
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
    context.strokeStyle = "black";
    context.fill();
    context.stroke();
  }
}
