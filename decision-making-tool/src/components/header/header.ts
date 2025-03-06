import { createDOMElement } from "@/utils";
import utilitiesStyles from "@/styles/utilities.module.css";
import styles from "@/components/header/header.module.css";
import { BaseComponent } from "@/components/base-component.ts";
import type { settingsButtons } from "@/type";

const APP_NAME = "Decision Making Tool";

export class Header extends BaseComponent<HTMLElement> {
  constructor(private readonly settings: settingsButtons[]) {
    super();
    this.settings = settings;
    const buttonWrapper = this.createButtons();
    this.element.append(buttonWrapper);
  }
  protected createView(): HTMLElement {
    const header = createDOMElement({
      tagName: "header",
      classList: [
        styles.header,
        utilitiesStyles.flex,
        utilitiesStyles.center,
        utilitiesStyles.justifyAround,
        utilitiesStyles.widthFull,
      ],
    });

    const headerPrimary = createDOMElement({
      tagName: "h1",
      textContent: APP_NAME,
      classList: [styles.headerPrimary],
    });

    header.append(headerPrimary);
    return header;
  }

  private createButtons(): HTMLDivElement {
    const buttonWrapper = createDOMElement({
      tagName: "div",
      classList: [
        utilitiesStyles.flex,
        utilitiesStyles.center,
        utilitiesStyles.gap30,
      ],
    });

    for (const { button, action } of this.settings) {
      button.addToggleListener(action);
      buttonWrapper.append(button.getElement());
    }
    return buttonWrapper;
  }
}
