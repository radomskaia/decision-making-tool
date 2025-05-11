import type {
  Callback,
  CallbackEvent,
  InputType,
  OptionItemValue,
} from "@/types";
import { BaseComponent } from "@/components/base-component.ts";
import { idElement } from "@/components/options/id/id-element.ts";
import { TitleInput } from "@/components/input/title-input.ts";
import { WeightInput } from "@/components/input/weight-input.ts";
import type { BaseButton } from "@/components/buttons/base/base-button.ts";
import { BUTTON_TEXT, ICON_PATH } from "@/constants/buttons-constants.ts";
import { IconButton } from "@/components/buttons/icon-button.ts";
import styles from "@/components/options/option.module.css";
import utilitiesStyles from "@/styles/utilities.module.css";

export class OptionItem extends BaseComponent<"li", OptionItemValue> {
  private readonly id: string;
  private title: TitleInput;
  private weight: WeightInput;
  private button: BaseButton;
  constructor(value?: OptionItemValue) {
    super();
    this.id = this.addID(value?.id);
    this.title = this.addTitleInput(value?.title);
    this.weight = this.addWeightInput(value?.weight);
    this.button = this.addDeleteButton();
  }
  public getValue(): OptionItemValue {
    return {
      id: this.id,
      title: this.title.value,
      weight: this.weight.value,
    };
  }

  public focusInput(): void {
    this.title.getElement().focus();
  }

  public addListener(
    type: "button" | InputType,
    callback: Callback | CallbackEvent,
  ): void {
    this[type].addListener(callback);
  }

  protected createView(): HTMLElementTagNameMap["li"] {
    return this.createDOMElement({
      tagName: "li",
      classList: [styles.optionItem, utilitiesStyles.flex, utilitiesStyles.gap10, utilitiesStyles.center, utilitiesStyles.widthFull],
    });
  }

  private addID(value?: string): string {
    const id = new idElement(value);
    this.appendElement(id.getElement());
    return id.id;
  }

  private addTitleInput(value?: string): TitleInput {
    const title = new TitleInput(value);
    const titleElement = title.getElement();
    titleElement.classList.add(styles.title, utilitiesStyles.widthFull);
    this.appendElement(titleElement);
    return title;
  }

  private addWeightInput(value?: string): WeightInput {
    const weight = new WeightInput(value);
    const weightElement = weight.getElement();
    weightElement.classList.add(styles.weight);
    this.appendElement(weightElement);
    return weight;
  }

  private addDeleteButton(): BaseButton {
    const button = new IconButton({
      title: BUTTON_TEXT.DELETE,
      path: ICON_PATH.DELETE,
    });
    button.getElement().classList.add(styles.button);
    button.addClassSVG(styles.icon);
    this.appendElement(button.getElement());
    return button;
  }
}
