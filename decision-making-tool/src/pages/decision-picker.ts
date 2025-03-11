import { BaseComponent } from "@/components/base-component.ts";
import utilitiesStyles from "@/styles/utilities.module.css";
import {
  BUTTON_TEXT,
  MIN_POSITIVE_NUMBER,
  MINIMUM_OPTIONS_COUNT,
  PAGE_PATH,
} from "@/constants/constants.ts";
import { TextButton } from "@/components/buttons/text-button.ts";
import { Router } from "@/services/router.ts";
import { Canvas } from "@/components/canvas/canvas.ts";
import { LocalStorage } from "@/services/local-storage.ts";
import type { OptionItemValue } from "@/types";
import { StorageKeys } from "@/types";
import { Validator } from "@/services/validator.ts";
import { CIRCLE_RADIUS_BIG } from "@/constants/canvas-constants.ts";

export class DecisionPicker extends BaseComponent<"main"> {
  private static instance: DecisionPicker | undefined;
  private canvas: Canvas;
  private data: OptionItemValue[] = [];
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
  public drawCanvas(): this {
    this.canvas.drawCircle(CIRCLE_RADIUS_BIG);
    const weightSum = this.calculateWeightSum();
    this.canvas.drawSectors(weightSum, [...this.data]);
    return this;
  }

  public getData(): OptionItemValue[] | null {
    const lsData = LocalStorage.getInstance().load(
      StorageKeys.optionListValue,
      Validator.getInstance().isOptionListValue.bind(Validator.getInstance()),
    );
    const data = lsData?.list.filter(
      (item) => item.title.trim() && Number(item.weight) > MIN_POSITIVE_NUMBER,
    );
    if (!data || data.length < MINIMUM_OPTIONS_COUNT) {
      return null;
    }
    console.log("getData", data);
    this.data = data;
    return data;
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

  private calculateWeightSum(): number {
    let accumulator = MIN_POSITIVE_NUMBER;
    for (const item of this.data) {
      const weight = Number(item.weight);
      accumulator += weight;
    }
    return accumulator;
  }

  private addButtons(): void {
    const backButton = new TextButton(BUTTON_TEXT.BACK, () =>
      Router.getInstance().navigateTo(PAGE_PATH.HOME),
    );
    const startButton = new TextButton(BUTTON_TEXT.START);
    this.appendElement(backButton.getElement(), startButton.getElement());
  }
}
