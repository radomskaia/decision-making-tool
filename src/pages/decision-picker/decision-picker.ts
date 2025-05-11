import { BaseComponent } from "@/components/base-component.ts";
import utilitiesStyles from "@/styles/utilities.module.css";
import { EMPTY_STRING, MESSAGES, PAGE_PATH } from "@/constants/constants.ts";
import { Router } from "@/services/router.ts";
import { Canvas } from "@/components/wheel/canvas.ts";
import { Wheel } from "@/components/wheel/wheel.ts";
import { DurationInput } from "@/components/input/duration-input.ts";
import { AudioService } from "@/services/settings/audio-service.ts";
import type { BaseButton } from "@/components/buttons/base/base-button.ts";
import type { ToggleViewState } from "@/types";
import styles from "@/pages/decision-picker/decision-picker.module.css";
import { DEFAULT_SETTINGS } from "@/constants/wheel-constants.ts";
import { DURATION_ID } from "@/constants/input-constants.ts";
import { BUTTON_TEXT, ICON_PATH } from "@/constants/buttons-constants.ts";
import { IconButton } from "@/components/buttons/icon-button.ts";

export class DecisionPicker extends BaseComponent<"main"> {
  private static instance: DecisionPicker | undefined;
  private readonly canvas: Canvas;
  private wheel: Wheel | undefined;
  private readonly text: HTMLParagraphElement;
  private controllerElements: (BaseButton | DurationInput)[] = [];
  private form: HTMLFormElement | null = null;
  private controlsWrapper: HTMLDivElement;
  private input: HTMLInputElement | null = null;
  private constructor() {
    super();

    this.canvas = new Canvas();
    this.text = this.createDOMElement({
      tagName: "p",
      textContent: MESSAGES.INIT_WHEEL_TEXT,
    });
    this.controlsWrapper = this.createControllsWrapper();
    this.appendElement(
      this.controlsWrapper,
      this.text,
      this.canvas.getElement(),
    );
  }
  public static getInstance(): DecisionPicker {
    if (!DecisionPicker.instance) {
      DecisionPicker.instance = new DecisionPicker();
    }
    return DecisionPicker.instance;
  }

  public isRenderWheel(): boolean {
    this.wheel = new Wheel(
      this.canvas.drawSectors,
      this.text,
      this.toggleViewState,
    );
    const isSectorData = this.wheel.isSectorData();
    if (isSectorData) {
      this.text.textContent = MESSAGES.INIT_WHEEL_TEXT;
      this.text.style.backgroundColor = EMPTY_STRING;
    }
    return isSectorData;
  }

  public focusInput(): void {
    this.input?.focus();
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
    const backButton = new IconButton(
      { title: BUTTON_TEXT.BACK, path: ICON_PATH.BACK },
      () => Router.getInstance().navigateTo(PAGE_PATH.HOME),
    );
    const startButton = new IconButton(
      { title: BUTTON_TEXT.START, path: ICON_PATH.PLAY },
      () => {
        if (this.wheel && this.form?.reportValidity()) {
          AudioService.getInstance().getButton().disabledElement(true);
          this.toggleViewState(false, EMPTY_STRING);
          this.wheel.animateWheel();
        }
      },
    );
    this.controllerElements.push(backButton, startButton);
    this.controlsWrapper.append(
      backButton.getElement(),
      startButton.getElement(),
    );
  }

  private createControllsWrapper(): HTMLDivElement {
    this.controlsWrapper = this.createDOMElement({
      tagName: "div",
      classList: [
        utilitiesStyles.flex,
        utilitiesStyles.center,
        utilitiesStyles.gap30,
      ],
    });
    this.addButtons();
    this.form = this.addInputForm();
    return this.controlsWrapper;
  }

  private toggleViewState: ToggleViewState = (isEnd, color) => {
    for (const element of this.controllerElements) {
      element.disabledElement(!isEnd);
    }
    this.text.classList.toggle(styles.highlight, isEnd);
    this.text.style.backgroundColor = color;
  };

  private addInputForm(): HTMLFormElement {
    const form = this.createDOMElement({
      tagName: "form",
      classList: [utilitiesStyles.positionRelative, styles.form],
    });
    const input = new DurationInput(DEFAULT_SETTINGS.DURATION.toString());
    this.controllerElements.push(input);
    input.addListener(() => this.wheel?.setDuration(Number(input.value)));
    const inputElement = input.getElement();
    inputElement.classList.add(styles.input);
    form.append(input.addLabel(DURATION_ID, [styles.label]), inputElement);
    this.controlsWrapper.append(form);
    this.input = inputElement;
    return form;
  }
}
