import { BaseInput } from "@/components/main/option-list/base-input.ts";

export class TitleInput extends BaseInput {
  constructor(value?: string) {
    super(value);
    this.element.placeholder = "Title";
    this.element.type = "text";
  }
}
