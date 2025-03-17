import { BaseInput } from "@/components/input/base-input.ts";
import { DEFAULT_SETTINGS } from "@/constants/wheel-constants.ts";
import { SYMBOLS } from "@/constants/constants.ts";
import { DURATION_ID, INPUT_TYPES } from "@/constants/input-constants.ts";

export class DurationInput extends BaseInput {
  private duration: number = DEFAULT_SETTINGS.DURATION;
  private id: string = DURATION_ID;
  constructor(value?: string) {
    super(value);
    this.element.type = INPUT_TYPES.NUMBER;
    this.element.min = this.duration.toString();
    this.element.addEventListener("beforeinput", (event) => {
      if (event.data === SYMBOLS.dash) {
        event.preventDefault();
      }
    });
    this.element.id = this.id;
  }

  public disabledElement(isDisabled: boolean): void {
    this.element.disabled = isDisabled;
  }

  public addLabel(label: string): HTMLLabelElement {
    return this.createDOMElement({
      tagName: "label",
      textContent: label,
      attributes: {
        for: this.id,
      },
    });
  }
}
