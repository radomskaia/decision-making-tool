import styles from "./button.module.css";

import type { ButtonOptions, Callback } from "@/type";
import { createDOMElement } from "@/utils";
import { BaseComponent } from "@/components/base-component.ts";

export class Button extends BaseComponent<"button", ButtonOptions> {
  protected createView(): HTMLButtonElement {
    return createDOMElement({
      tagName: "button",
      classList: [styles.button],
    });
  }

  public buttonDisabled(isDisabled: boolean): void {
    this.element.disabled = isDisabled;
  }

  public addListener(callback: Callback): void {
    this.element.addEventListener("click", callback);
  }
}
