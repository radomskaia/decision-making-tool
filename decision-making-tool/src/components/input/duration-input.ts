import { BaseInput } from "@/components/input/base-input.ts";
import { DEFAULT_DURATION } from "@/constants/canvas-constants.ts";

export class DurationInput extends BaseInput {
  constructor(value?: string) {
    super(value);
    this.element.type = "number";
    this.element.min = DEFAULT_DURATION.toString();
    this.element.addEventListener("beforeinput", (event) => {
      if (event.data === "-") {
        event.preventDefault();
      }
    });
  }
}
