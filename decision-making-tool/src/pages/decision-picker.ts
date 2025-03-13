import { BaseComponent } from "@/components/base-component.ts";
import utilitiesStyles from "@/styles/utilities.module.css";
import { BUTTON_TEXT, PAGE_PATH } from "@/constants/constants.ts";
import { TextButton } from "@/components/buttons/text-button.ts";
import { Router } from "@/services/router.ts";
import { Canvas } from "@/components/canvas/canvas.ts";
import { Wheel } from "@/components/canvas/wheel.ts";
import { DurationInput } from "@/components/input/duration-input.ts";
import { DEFAULT_DURATION } from "@/constants/canvas-constants.ts";

export class DecisionPicker extends BaseComponent<"main"> {
  private static instance: DecisionPicker | undefined;
  private readonly canvas: Canvas;
  private wheel: Wheel | undefined;
  private readonly text: HTMLParagraphElement;
  private constructor() {
    super();
    this.addButtons();
    this.addInput();
    this.canvas = new Canvas();
    this.text = this.createDOMElement({
      tagName: "p",
      textContent: "Hello",
    });

    this.appendElement(this.canvas.getElement(), this.text);
  }
  public static getInstance(): DecisionPicker {
    if (!DecisionPicker.instance) {
      DecisionPicker.instance = new DecisionPicker();
    }
    return DecisionPicker.instance;
  }

  public isRenderWheel(): boolean {
    this.wheel = new Wheel(this.canvas, this.text);
    return this.wheel.isSectorData();
  }

  protected createView(): HTMLElementTagNameMap["main"] {
    return this.createDOMElement({
      tagName: "main",
      classList: [
        utilitiesStyles.container,
        utilitiesStyles.flex,
        utilitiesStyles.gap30,
        utilitiesStyles.flexColumn,
        utilitiesStyles.alignCenter,
      ],
    });
  }

  private addButtons(): void {
    const backButton = new TextButton(BUTTON_TEXT.BACK, () =>
      Router.getInstance().navigateTo(PAGE_PATH.HOME),
    );
    const startButton = new TextButton(BUTTON_TEXT.START, () => {
      if (this.wheel) {
        this.wheel.animate();
      }
    });
    this.appendElement(backButton.getElement(), startButton.getElement());
  }

  private addInput(): void {
    const input = new DurationInput(DEFAULT_DURATION.toString());
    input.addListener(() => this.wheel?.setDuration(Number(input.value)));
    this.appendElement(input.getElement());
  }
}
