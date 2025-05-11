import type { Callback } from "@/types";
import { BaseButton } from "@/components/buttons/base/base-button.ts";
import styles from "@/components/buttons/base/button.module.css";

export class TextButton extends BaseButton {
  constructor(text: string, callback?: Callback) {
    super(callback);
    this.element.textContent = text;
    this.addClassList([styles.actionButton]);
  }
}
