import { BaseModal } from "@/components/modal/base/base-modal.ts";
import { TextButton } from "@/components/buttons/text-button.ts";
import { MESSAGES } from "@/constants/constants.ts";
import utilitiesStyles from "@/styles/utilities.module.css";
import { BUTTON_TEXT } from "@/constants/buttons-constants.ts";
import styles from "@/components/modal/base/modal.module.css";

export class ValidModal extends BaseModal {
  private static instance: ValidModal | undefined;
  private constructor() {
    super();
    this.addContent();
  }
  public static getInstance(): ValidModal {
    if (!ValidModal.instance) {
      ValidModal.instance = new ValidModal();
    }

    return ValidModal.instance;
  }
  protected addContent(): HTMLDivElement {
    const div = this.createDOMElement({
      tagName: "div",
      classList: [
        utilitiesStyles.flex,
        utilitiesStyles.flexColumn,
        utilitiesStyles.alignCenter,
        utilitiesStyles.gap20,
      ],
    });
    const text = this.createDOMElement({
      tagName: "p",
      classList: [styles.validText],
      textContent: MESSAGES.VALIDATION,
    });

    const cancelButton = new TextButton(BUTTON_TEXT.CLOSE, () => {
      this.closeModal();
    }).getElement();

    div.append(text, cancelButton);
    return div;
  }
}
