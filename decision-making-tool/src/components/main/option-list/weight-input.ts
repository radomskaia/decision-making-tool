import { BaseInput } from "@/components/main/option-list/base-input.ts";
import { PLACEHOLDER } from "@/constants.ts";

export class WeightInput extends BaseInput {
  constructor(value?: string) {
    super(value);
    this.element.placeholder = PLACEHOLDER.WEIGHT;
    this.element.type = "number";
    this.element.min = "0";
  }
}
