import { BaseComponent } from "@/components/base-component.ts";
import utilitiesStyles from "@/styles/utilities.module.css";
import { TextButton } from "@/components/button/text-button.ts";

export class NotFound extends BaseComponent<"div"> {
  private static instance: NotFound | undefined;
  public static getInstance(): NotFound {
    if (!NotFound.instance) {
      NotFound.instance = new NotFound();
    }
    return NotFound.instance;
  }
  private homeButton: TextButton;
  private constructor() {
    super();
    this.homeButton = new TextButton("Back to the start page");
    this.appendElement(this.homeButton.getElement());
  }

  protected createView(): HTMLElementTagNameMap["div"] {
    return this.createDOMElement({
      tagName: "div",
      textContent: "Sorry, page not found",
      classList: [
        utilitiesStyles.flex,
        utilitiesStyles.container,
        utilitiesStyles.flexColumn,
        utilitiesStyles.center,
      ],
    });
  }
  public addHomeButtonListener(callback: () => void): void {
    this.homeButton.addListener(callback);
  }
}
