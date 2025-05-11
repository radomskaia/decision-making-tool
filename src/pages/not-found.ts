import { BaseComponent } from "@/components/base-component.ts";
import utilitiesStyles from "@/styles/utilities.module.css";
import { TextButton } from "@/components/buttons/text-button.ts";
import { MESSAGES, PAGE_PATH } from "@/constants/constants.ts";
import { Router } from "@/services/router.ts";
import { BUTTON_TEXT } from "@/constants/buttons-constants.ts";

export class NotFound extends BaseComponent<"main"> {
  private static instance: NotFound | undefined;
  private homeButton: TextButton;
  private constructor() {
    super();
    this.homeButton = new TextButton(BUTTON_TEXT.HOME, () =>
      Router.getInstance().navigateTo(PAGE_PATH.HOME),
    );
    this.appendElement(this.homeButton.getElement());
  }
  public static getInstance(): NotFound {
    if (!NotFound.instance) {
      NotFound.instance = new NotFound();
    }
    return NotFound.instance;
  }

  protected createView(): HTMLElementTagNameMap["main"] {
    const main = this.createDOMElement({
      tagName: "main",
      classList: [
        utilitiesStyles.flex,
        utilitiesStyles.container,
        utilitiesStyles.flexColumn,
        utilitiesStyles.center,
        utilitiesStyles.gap30,
      ],
    });

    const text = this.createDOMElement({
      tagName: "p",
      textContent: MESSAGES.PAGE_NOT_FOUND,
    });

    main.append(text);
    return main;
  }
}
