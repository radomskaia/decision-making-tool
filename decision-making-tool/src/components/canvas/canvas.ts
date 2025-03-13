import { BaseComponent } from "@/components/base-component.ts";
import {
  CANVAS_SIZE,
  CENTER,
  CIRCLE_RADIUS_BIG,
  CIRCLE_RADIUS_SMALL,
  DOUBLE,
  END_ANGLE,
  ORIGIN_COORDINATE,
  HALF,
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
  GLOBAL_ALPHA,
} from "@/constants/canvas-constants.ts";
import type { DrawSector, DrawSectors, DrawText } from "@/types";
import { FIRST_INDEX, LAST_INDEX } from "@/constants/constants.ts";

export class Canvas extends BaseComponent<"canvas"> {
  private context: CanvasRenderingContext2D;
  constructor() {
    super();
    this.context = this.getContext();
    this.context.globalAlpha = GLOBAL_ALPHA;
    this.drawCircle(CIRCLE_RADIUS_BIG);
    this.drawClip();
  }

  private static calculateTextCoordinates(
    startAngle: number,
    endAngle: number,
  ): { textX: number; textY: number; textAngle: number } {
    const middleAngle = (startAngle + endAngle) / DOUBLE;
    const textRadius = CIRCLE_RADIUS_BIG * TEXT_OFFSET;
    const textX = CENTER + Math.cos(middleAngle) * textRadius;
    const textY = CENTER + Math.sin(middleAngle) * textRadius;
    const textAngle = middleAngle + Math.PI / HALF;
    return { textX, textY, textAngle };
  }

  public drawSectors: DrawSectors = (sectorData, offset, updateSector) => {
    this.context.clearRect(
      ORIGIN_COORDINATE,
      ORIGIN_COORDINATE,
      CANVAS_SIZE,
      CANVAS_SIZE,
    );
    for (const sectorItem of sectorData) {
      let { startAngle, angle, color, title, isTitle } = sectorItem;
      if (offset && updateSector) {
        sectorItem.startAngle += offset;
        updateSector(startAngle, angle, title);
      }
      const endAngle = startAngle + angle;

      this.drawSector(startAngle, endAngle, color);
      if (isTitle) {
        const { textX, textY, textAngle } = Canvas.calculateTextCoordinates(
          startAngle,
          endAngle,
        );
        this.drawText(this.truncateText(title), textX, textY, textAngle);
      }
    }
    this.drawCircle(CIRCLE_RADIUS_SMALL);
    this.drawCursor();
  };
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

  public getContext(): CanvasRenderingContext2D {
    const context = this.element.getContext("2d");
    if (!context) {
      throw new Error("Failed to get context");
    }
    return context;
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
    context.lineTo(CENTER - CURSOR_HORIZONTAL_SPREAD / DOUBLE, CURSOR_BOTTOM_Y);
    context.lineTo(CENTER, CURSOR_MIDDLE_POINT_Y);
    context.lineTo(CENTER + CURSOR_HORIZONTAL_SPREAD / DOUBLE, CURSOR_BOTTOM_Y);
    context.closePath();
    context.fillStyle = CURSOR_COLOR;
    context.strokeStyle = STROKE_COLOR;
    context.fill();
    context.stroke();
  }

  private drawSector: DrawSector = (startAngle, endAngle, color) => {
    const { context } = this;
    context.beginPath();
    context.moveTo(CENTER, CENTER);
    context.arc(CENTER, CENTER, CIRCLE_RADIUS_BIG, startAngle, endAngle);
    context.closePath();
    context.fillStyle = color;
    context.strokeStyle = STROKE_COLOR;
    context.fill();
    context.stroke();
  };

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

  private drawText: DrawText = (text, x, y, angle) => {
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
  };
}
