import { BaseComponent } from "@/components/base-component.ts";
import utilitiesStyles from "@/styles/utilities.module.css";
import { BUTTON_TEXT, PAGE_PATH } from "@/constants/constants.ts";
import { TextButton } from "@/components/buttons/text-button.ts";
import { Router } from "@/services/router.ts";
import { Canvas } from "@/components/canvas/canvas.ts";
import { Wheel } from "@/components/canvas/wheel.ts";

export class DecisionPicker extends BaseComponent<"main"> {
  private static instance: DecisionPicker | undefined;
  private canvas: Canvas;
  private constructor() {
    super();
    this.addButtons();
    this.canvas = new Canvas();
    this.appendElement(this.canvas.getElement());
  }
  public static getInstance(): DecisionPicker {
    if (!DecisionPicker.instance) {
      DecisionPicker.instance = new DecisionPicker();
    }
    return DecisionPicker.instance;
  }

  public isRenderWheel(): boolean {
    return new Wheel(this.canvas).isSectorData();
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
    const startButton = new TextButton(BUTTON_TEXT.START);
    this.appendElement(backButton.getElement(), startButton.getElement());
  }
}
