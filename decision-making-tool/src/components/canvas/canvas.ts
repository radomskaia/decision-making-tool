import { BaseComponent } from "@/components/base-component.ts";
import {
  CANVAS_SIZE,
  CENTER,
  CIRCLE_RADIUS_BIG,
  CIRCLE_RADIUS_SMALL,
  DIVIDER,
  END_ANGLE,
  ORIGIN_COORDINATE,
  HALF_OFFSET,
  START_ANGLE,
  STROKE_COLOR,
  FONT_SIZE,
  MAX_TEXT_WIDTH,
  TEXT_OFFSET,
  CURSOR_COLOR,
  CURSOR_TOP_Y,
  CURSOR_BOTTOM_Y,
  CURSOR_MIDDLE_POINT_Y,
  CURSOR_HORIZONTAL_SPREAD,
  FONT_FAMILY,
} from "@/constants/canvas-constants.ts";
import type { SectorData } from "@/types";
import { FIRST_INDEX, LAST_INDEX } from "@/constants/constants.ts";

export class Canvas extends BaseComponent<"canvas"> {
  private context: CanvasRenderingContext2D;
  constructor() {
    super();
    this.context = this.getContext();
    this.drawCircle(CIRCLE_RADIUS_BIG);
    this.drawClip();
  }

  private static calculateTextCoordinates(
    startAngle: number,
    endAngle: number,
  ): { textX: number; textY: number; textAngle: number } {
    const middleAngle = (startAngle + endAngle) / DIVIDER;
    const textRadius = CIRCLE_RADIUS_BIG * TEXT_OFFSET;
    const textX = CENTER + Math.cos(middleAngle) * textRadius;
    const textY = CENTER + Math.sin(middleAngle) * textRadius;
    const textAngle = middleAngle + Math.PI / HALF_OFFSET;
    return { textX, textY, textAngle };
  }

  public drawSectors(sectorData: SectorData[]): void {
    this.context.clearRect(
      ORIGIN_COORDINATE,
      ORIGIN_COORDINATE,
      CANVAS_SIZE,
      CANVAS_SIZE,
    );
    for (const { startAngle, endAngle, color, title } of sectorData) {
      this.drawSector(startAngle, endAngle, color);
      if (title) {
        const { textX, textY, textAngle } = Canvas.calculateTextCoordinates(
          startAngle,
          endAngle,
        );
        this.drawText(this.truncateText(title), textX, textY, textAngle);
      }
    }
    this.drawCircle(CIRCLE_RADIUS_SMALL);
    this.drawCursor();
  }
  public drawCircle(radius: number): void {
    const { context } = this;
    if (radius === CIRCLE_RADIUS_SMALL) {
      context.lineWidth++;
    }
    context.beginPath();
    context.arc(CENTER, CENTER, radius, START_ANGLE, END_ANGLE, true);
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
      CENTER,
      CENTER,
      CIRCLE_RADIUS_SMALL,
      START_ANGLE,
      END_ANGLE,
      true,
    );
    context.clip();
  }

  private drawCursor(): void {
    const { context } = this;
    context.beginPath();
    context.moveTo(CENTER, CURSOR_TOP_Y);
    context.lineTo(
      CENTER - CURSOR_HORIZONTAL_SPREAD / DIVIDER,
      CURSOR_BOTTOM_Y,
    );
    context.lineTo(CENTER, CURSOR_MIDDLE_POINT_Y);
    context.lineTo(
      CENTER + CURSOR_HORIZONTAL_SPREAD / DIVIDER,
      CURSOR_BOTTOM_Y,
    );
    context.closePath();
    context.fillStyle = CURSOR_COLOR;
    context.strokeStyle = STROKE_COLOR;
    context.fill();
    context.stroke();
  }

  private getContext(): CanvasRenderingContext2D {
    const context = this.element.getContext("2d");
    if (!context) {
      throw new Error("Failed to get context");
    }
    return context;
  }

  private drawSector(
    startAngle: number,
    endAngle: number,
    color: string,
  ): void {
    const { context } = this;
    context.beginPath();
    context.moveTo(CENTER, CENTER);
    context.arc(CENTER, CENTER, CIRCLE_RADIUS_BIG, startAngle, endAngle);
    context.closePath();
    context.fillStyle = color;
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
    context.save();
    context.translate(x, y);
    context.rotate(angle);
    context.font = `${FONT_SIZE}px ${FONT_FAMILY}`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = STROKE_COLOR;
    context.fillText(text, ORIGIN_COORDINATE, ORIGIN_COORDINATE);
    context.restore();
  }
}
