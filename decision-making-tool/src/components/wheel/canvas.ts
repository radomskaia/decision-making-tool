import { BaseComponent } from "@/components/base-component.ts";
import {
  CANVAS_SIZE,
  CIRCLE,
  CURSOR,
  TEXT,
} from "@/constants/wheel-constants.ts";
import type {
  DrawSector,
  DrawSectors,
  DrawText,
  MainWheelColors,
} from "@/types";
import {
  DOUBLE,
  FIRST_INDEX,
  LAST_INDEX,
  MESSAGES,
  ZERO,
} from "@/constants/constants.ts";
import { calculateTextCoordinates } from "@/utilities/utilities.ts";

export class Canvas extends BaseComponent<"canvas", number> {
  private context: CanvasRenderingContext2D;
  constructor(ratio = window.devicePixelRatio) {
    super(ratio);
    this.context = this.getContext();
    this.context.scale(ratio, ratio);
    this.drawClip();
  }

  public drawSectors: DrawSectors = (sectorData, wheelColors, options) => {
    this.context.clearRect(ZERO, ZERO, CANVAS_SIZE, CANVAS_SIZE);
    for (const sectorItem of sectorData) {
      let { startAngle, angle, color, title, isTitle } = sectorItem;
      if (options) {
        const { offset, updateSector } = options;
        sectorItem.startAngle += offset;
        if (sectorItem.startAngle > CIRCLE.FULL_RADIAN) {
          sectorItem.startAngle -= CIRCLE.FULL_RADIAN;
        }
        updateSector(startAngle, angle, title, color);
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
          wheelColors,
        );
      }
    }
    this.drawCentralCircle(wheelColors.stroke);
    this.drawCursor(wheelColors, options?.angle);
  };

  public getContext(): CanvasRenderingContext2D {
    const context = this.element.getContext("2d");
    if (!context) {
      throw new Error(MESSAGES.CONTEXT_NOT_FOUND);
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
    context.moveTo(CIRCLE.CENTER.X, CURSOR.Y.TOP);
    context.lineTo(CIRCLE.CENTER.X - CURSOR.WIDTH / DOUBLE, CURSOR.Y.BOTTOM);
    context.lineTo(CIRCLE.CENTER.X, CURSOR.Y.MIDDLE);
    context.lineTo(CIRCLE.CENTER.X + CURSOR.WIDTH / DOUBLE, CURSOR.Y.BOTTOM);

    context.closePath();
    context.fillStyle = colors.cursor;
    context.strokeStyle = colors.stroke;
    context.fill();
    context.stroke();
    context.restore();
  }

  protected createView(ratio: number): HTMLElementTagNameMap["canvas"] {
    const size = CANVAS_SIZE * ratio;
    const canvas = this.createDOMElement({
      tagName: "canvas",
      attributes: {
        width: size.toString(),
        height: size.toString(),
      },
    });
    if (size > CANVAS_SIZE) {
      canvas.style.width = CANVAS_SIZE.toString() + "px";
    }
    return canvas;
  }

  private drawCentralCircle(strokeColor: string): void {
    const { context } = this;
    context.lineWidth++;
    context.beginPath();
    context.arc(
      CIRCLE.CENTER.X,
      CIRCLE.CENTER.Y,
      CIRCLE.RADIUS.SMALL,
      CIRCLE.START_ANGLE,
      CIRCLE.FULL_RADIAN,
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
    context.rect(ZERO, ZERO, CANVAS_SIZE, CANVAS_SIZE);
    context.arc(
      CIRCLE.CENTER.X,
      CIRCLE.CENTER.Y,
      CIRCLE.RADIUS.SMALL,
      CIRCLE.START_ANGLE,
      CIRCLE.FULL_RADIAN,
      true,
    );
    context.clip();
  }

  private rotateCursor(angle: number): void {
    const { context } = this;
    context.translate(CIRCLE.CENTER.X, CURSOR.Y.MIDDLE);
    context.rotate(angle);
    context.translate(-CIRCLE.CENTER.X, -CURSOR.Y.MIDDLE);
  }

  private drawSector: DrawSector = (
    startAngle,
    endAngle,
    color,
    strokeColor,
  ) => {
    const { context } = this;
    context.beginPath();
    context.moveTo(CIRCLE.CENTER.X, CIRCLE.CENTER.Y);
    context.arc(
      CIRCLE.CENTER.X,
      CIRCLE.CENTER.Y,
      CIRCLE.RADIUS.BIG,
      startAngle,
      endAngle,
    );
    context.closePath();
    context.fillStyle = color;
    context.strokeStyle = strokeColor;
    context.fill();
    context.stroke();
  };

  private truncateText(text: string): string {
    const { context } = this;
    let textWidth = context.measureText(text).width;

    if (!(textWidth > TEXT.MAX_WIDTH)) {
      return text;
    }

    let truncatedText = text;
    let renderText = truncatedText + TEXT.ELLIPSIS;

    while (textWidth > TEXT.MAX_WIDTH) {
      truncatedText = truncatedText.slice(FIRST_INDEX, LAST_INDEX);
      renderText = truncatedText + TEXT.ELLIPSIS;
      textWidth = context.measureText(renderText).width;
    }
    truncatedText += TEXT.ELLIPSIS;

    return truncatedText;
  }

  private drawText: DrawText = (text, x, y, angle, colors) => {
    const { context } = this;
    context.save();
    context.translate(x, y);
    context.rotate(angle);
    context.font = `${TEXT.FONT.SIZE} ${TEXT.FONT.FAMILY}`;
    context.textAlign = TEXT.ALIGN;
    context.textBaseline = TEXT.BASELINE;
    context.fillStyle = colors.stroke;
    context.strokeStyle = colors.cursor;
    context.strokeText(text, ZERO, ZERO);
    context.fillText(text, ZERO, ZERO);
    context.restore();
  };
}
