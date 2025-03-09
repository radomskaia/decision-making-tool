import { Button } from "@/components/button/button.ts";

export class TextButton extends Button {
  constructor(text: string) {
    super();
    this.element.textContent = text;
  }
}
