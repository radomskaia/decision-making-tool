import { BaseComponent } from "@/components/base-component.ts";
import utilitiesStyles from "@/styles/utilities.module.css";
import { BUTTON_TEXT, PAGE_PATH } from "@/constants/constants.ts";
import { TextButton } from "@/components/buttons/text-button.ts";
import { Router } from "@/services/router.ts";
import { Canvas } from "@/components/wheel/canvas.ts";
import { Wheel } from "@/components/wheel/wheel.ts";
import { DurationInput } from "@/components/input/duration-input.ts";
import { DEFAULT_DURATION } from "@/constants/canvas-constants.ts";
import { AudioService } from "@/components/settings/audio-service.ts";
import type { BaseButton } from "@/components/buttons/base/base-button.ts";
import type { ToggleViewState } from "@/types";
import styles from "@/pages/decision-picker/decision-picker.module.css";

export class DecisionPicker extends BaseComponent<"main"> {
  private static instance: DecisionPicker | undefined;
  private readonly canvas: Canvas;
  private wheel: Wheel | undefined;
  private readonly text: HTMLParagraphElement;
  private controllerElements: (BaseButton | DurationInput)[] = [];
  private form: HTMLFormElement;
  private constructor() {
    super();
    this.addButtons();
    this.form = this.addInputForm();
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
    this.wheel = new Wheel(this.canvas.drawSectors, this.text);
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
      if (this.wheel && this.form.reportValidity()) {
        AudioService.getInstance().getButton().disabledElement(true);
        this.toggleViewState(false);
        this.wheel.animateWheel(this.toggleViewState);
      }
    });
    this.controllerElements.push(backButton, startButton);
    this.appendElement(backButton.getElement(), startButton.getElement());
  }

  private toggleViewState: ToggleViewState = (isEnd) => {
    for (const element of this.controllerElements) {
      element.disabledElement(!isEnd);
    }

    this.text.classList.toggle(styles.highlight, isEnd);
  };

  private addInputForm(): HTMLFormElement {
    const form = this.createDOMElement({
      tagName: "form",
    });
    const input = new DurationInput(DEFAULT_DURATION.toString());
    this.controllerElements.push(input);
    input.addListener(() => this.wheel?.setDuration(Number(input.value)));
    form.append(input.addLabel("Duration"), input.getElement());
    this.appendElement(form);
    return form;
  }
}
