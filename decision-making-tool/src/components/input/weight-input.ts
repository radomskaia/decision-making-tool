import { BaseInput } from "@/components/input/base-input.ts";
import { ZERO, PLACEHOLDER } from "@/constants/constants.ts";

export class WeightInput extends BaseInput {
  constructor(value?: string) {
    super(value);
    this.element.placeholder = PLACEHOLDER.WEIGHT;
    this.element.type = "number";
    this.element.step = "any";
    this.element.min = ZERO.toString();
    this.element.addEventListener("beforeinput", (event) => {
      if (event.data === "-") {
        event.preventDefault();
      }
    });
  }
}
