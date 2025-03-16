import { BaseComponent } from "@/components/base-component.ts";
import {
  CANVAS_SIZE,
  CENTER_X,
  CIRCLE_RADIUS_BIG,
  CIRCLE_RADIUS_SMALL,
  DOUBLE,
  END_ANGLE,
  ORIGIN_COORDINATE,
  START_ANGLE,
  FONT_SIZE,
  MAX_TEXT_WIDTH,
  CURSOR_TOP_Y,
  CURSOR_BOTTOM_Y,
  CURSOR_MIDDLE_POINT_Y,
  CURSOR_HORIZONTAL_SPREAD,
  FONT_FAMILY,
  GLOBAL_ALPHA,
  CENTER_Y,
  FULL_CIRCLE,
} from "@/constants/canvas-constants.ts";
import type {
  DrawSector,
  DrawSectors,
  DrawText,
  MainWheelColors,
} from "@/types";
import { FIRST_INDEX, LAST_INDEX } from "@/constants/constants.ts";
import { calculateTextCoordinates } from "@/utilities/utilities.ts";

export class Canvas extends BaseComponent<"canvas"> {
  private context: CanvasRenderingContext2D;
  constructor() {
    super();
    this.context = this.getContext();
    this.context.globalAlpha = GLOBAL_ALPHA;
    this.drawClip();
  }

  public drawSectors: DrawSectors = (sectorData, wheelColors, options) => {
    this.context.clearRect(
      ORIGIN_COORDINATE,
      ORIGIN_COORDINATE,
      CANVAS_SIZE,
      CANVAS_SIZE,
    );
    for (const sectorItem of sectorData) {
      let { startAngle, angle, color, title, isTitle } = sectorItem;
      if (options) {
        const { offset, updateSector } = options;
        sectorItem.startAngle += offset;
        if (sectorItem.startAngle > FULL_CIRCLE) {
          sectorItem.startAngle -= FULL_CIRCLE;
        }
        updateSector(startAngle, angle, title);
      }
      const endAngle = startAngle + angle;

      this.drawSector(startAngle, endAngle, color, wheelColors.stroke);
      if (isTitle) {
        const { textX, textY, textAngle } = calculateTextCoordinates(
          startAngle,
          endAngle,
        );
        this.drawText(
          this.truncateText(title),
          textX,
          textY,
          textAngle,
          wheelColors.stroke,
        );
      }
    }
    this.drawCentralCircle(wheelColors.stroke);
    this.drawCursor(wheelColors, options?.angle);
  };

  public getContext(): CanvasRenderingContext2D {
    const context = this.element.getContext("2d");
    if (!context) {
      throw new Error("Failed to get context");
    }
    return context;
  }

  public drawCursor(colors: MainWheelColors, angle?: number): void {
    const { context } = this;
    context.save();
    if (angle) {
      this.rotateCursor(angle);
    }
    context.beginPath();
    context.moveTo(CENTER_X, CURSOR_TOP_Y);
    context.lineTo(
      CENTER_X - CURSOR_HORIZONTAL_SPREAD / DOUBLE,
      CURSOR_BOTTOM_Y,
    );
    context.lineTo(CENTER_X, CURSOR_MIDDLE_POINT_Y);
    context.lineTo(
      CENTER_X + CURSOR_HORIZONTAL_SPREAD / DOUBLE,
      CURSOR_BOTTOM_Y,
    );

    context.closePath();
    context.fillStyle = colors.cursor;
    context.strokeStyle = colors.stroke;
    context.fill();
    context.stroke();
    context.restore();
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

  private drawCentralCircle(strokeColor: string): void {
    const { context } = this;
    context.lineWidth++;
    context.beginPath();
    context.arc(
      CENTER_X,
      CENTER_Y,
      CIRCLE_RADIUS_SMALL,
      START_ANGLE,
      END_ANGLE,
      true,
    );
    context.closePath();
    context.strokeStyle = strokeColor;
    context.stroke();
    context.lineWidth--;
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
      CENTER_X,
      CENTER_Y,
      CIRCLE_RADIUS_SMALL,
      START_ANGLE,
      END_ANGLE,
      true,
    );
    context.clip();
  }

  private rotateCursor(angle: number): void {
    const { context } = this;
    context.translate(CENTER_X, CURSOR_MIDDLE_POINT_Y);
    context.rotate(angle);
    context.translate(-CENTER_X, -CURSOR_MIDDLE_POINT_Y);
  }

  private drawSector: DrawSector = (
    startAngle,
    endAngle,
    color,
    strokeColor,
  ) => {
    const { context } = this;
    context.beginPath();
    context.moveTo(CENTER_X, CENTER_Y);
    context.arc(CENTER_X, CENTER_Y, CIRCLE_RADIUS_BIG, startAngle, endAngle);
    context.closePath();
    context.fillStyle = color;
    context.strokeStyle = strokeColor;
    context.fill();
    context.stroke();
  };

  private truncateText(text: string): string {
    const { context } = this;
    const ellipsis = "...";
    let textWidth = context.measureText(text).width;

    if (!(textWidth > MAX_TEXT_WIDTH)) {
      return text;
    }

    let truncatedText = text;
    let renderText = truncatedText + ellipsis;

    while (textWidth > MAX_TEXT_WIDTH) {
      truncatedText = truncatedText.slice(FIRST_INDEX, LAST_INDEX);
      renderText = truncatedText + ellipsis;
      textWidth = context.measureText(renderText).width;
    }
    truncatedText += ellipsis;

    return truncatedText;
  }

  private drawText: DrawText = (text, x, y, angle, strokeColor) => {
    const { context } = this;
    context.save();
    context.translate(x, y);
    context.rotate(angle);
    context.font = `${FONT_SIZE}px ${FONT_FAMILY}`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = strokeColor;
    context.fillText(text, ORIGIN_COORDINATE, ORIGIN_COORDINATE);
    context.restore();
  };
}
