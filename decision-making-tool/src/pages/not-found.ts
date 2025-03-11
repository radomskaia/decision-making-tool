import { BaseComponent } from "@/components/base-component.ts";
import utilitiesStyles from "@/styles/utilities.module.css";
import { TextButton } from "@/components/buttons/text-button.ts";
import { BUTTON_TEXT, ERROR_MESSAGES } from "@/constants/constants.ts";

export class NotFound extends BaseComponent<"div"> {
  private static instance: NotFound | undefined;
  private homeButton: TextButton;
  private constructor() {
    super();
    this.homeButton = new TextButton(BUTTON_TEXT.HOME);
    this.appendElement(this.homeButton.getElement());
  }
  public static getInstance(): NotFound {
    if (!NotFound.instance) {
      NotFound.instance = new NotFound();
    }
    return NotFound.instance;
  }

  public addHomeButtonListener(callback: () => void): void {
    this.homeButton.addListener(callback);
  }
  protected createView(): HTMLElementTagNameMap["div"] {
    return this.createDOMElement({
      tagName: "div",
      textContent: ERROR_MESSAGES.PAGE_NOT_FOUND,
      classList: [
        utilitiesStyles.flex,
        utilitiesStyles.container,
        utilitiesStyles.flexColumn,
        utilitiesStyles.center,
      ],
    });
  }
}
