import type {
  Callback,
  CallbackEvent,
  InputType,
  OptionItemValue,
} from "@/types";
import { BaseComponent } from "@/components/base-component.ts";
import { idElement } from "@/components/options/id/id-element.ts";
import { TitleInput } from "@/components/options/input/title-input.ts";
import { WeightInput } from "@/components/options/input/weight-input.ts";
import { TextButton } from "@/components/buttons/text-button.ts";
import type { BaseButton } from "@/components/buttons/base/base-button.ts";
import { BUTTON_TEXT } from "@/constants/constants.ts";

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

  public addListener(
    type: "button" | InputType,
    callback: Callback | CallbackEvent,
  ): void {
    this[type].addListener(callback);
  }

  protected createView(): HTMLElementTagNameMap["li"] {
    return this.createDOMElement({
      tagName: "li",
    });
  }

  private addID(value?: string): string {
    const id = new idElement(value);
    this.appendElement(id.getElement());
    return id.id;
  }

  private addTitleInput(value?: string): TitleInput {
    const title = new TitleInput(value);
    this.appendElement(title.getElement());
    return title;
  }

  private addWeightInput(value?: string): WeightInput {
    const weight = new WeightInput(value);
    this.appendElement(weight.getElement());
    return weight;
  }

  private addDeleteButton(): BaseButton {
    const button = new TextButton(BUTTON_TEXT.DELETE);
    this.appendElement(button.getElement());
    return button;
  }
}
