import { BaseInput } from "@/components/main/option-list/base-input.ts";
import { PLACEHOLDER } from "@/constants.ts";

export class TitleInput extends BaseInput {
  constructor(value?: string) {
    super(value);
    this.element.placeholder = PLACEHOLDER.TITLE;
    this.element.type = "text";
  }
}
