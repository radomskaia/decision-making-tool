import { Button } from "@/components/button/button.ts";
import styles from "@/components/button/button.module.css";

export class TextButton extends Button {
  constructor(text: string) {
    super();
    this.element.textContent = text;
    this.addClassList(this.element, [styles.actionButton]);
  }
}
