import { BaseInput } from "@/components/options/input/base-input.ts";
import { PLACEHOLDER } from "@/constants/constants.ts";

export class TitleInput extends BaseInput {
  constructor(value?: string) {
    super(value);
    this.element.placeholder = PLACEHOLDER.TITLE;
    this.element.type = "text";
  }
}
