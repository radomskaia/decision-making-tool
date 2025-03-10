import { Button } from "@/components/button/button.ts";
import styles from "@/components/button/button.module.css";
import type { Callback } from "@/type";

export class TextButton extends Button {
  constructor(text: string, callback?: Callback) {
    super(callback);
    this.element.textContent = text;
    this.addClassList(this.element, [styles.actionButton]);
  }
}
