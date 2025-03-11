import { BaseModal } from "@/components/modal/base/base-modal.ts";
import { TextButton } from "@/components/buttons/text-button.ts";
import styles from "@/components/modal/base/modal.module.css";
import utilitiesStyles from "@/styles/utilities.module.css";
import type { Callback } from "src/types";
import type { OptionList } from "@/components/options/option-list/option-list.ts";
import {
  BUTTON_TEXT,
  EMPTY_STRING,
  MESSAGES,
  PLACEHOLDER,
  TEXTAREA_COLS,
  TEXTAREA_ROWS,
} from "@/constants/constants.ts";
import { FileHandler } from "@/services/file-handler.ts";

export class PasteModal extends BaseModal {
  private static instance: PasteModal | undefined;
  private constructor(private readonly optionList: OptionList) {
    super();
    this.optionList = optionList;
  }
  public static getInstance(optionList?: OptionList): PasteModal {
    if (!PasteModal.instance && optionList) {
      PasteModal.instance = new PasteModal(optionList);
    }
    if (!PasteModal.instance) {
      throw new Error(MESSAGES.NOT_INITIALIZED);
    }
    return PasteModal.instance;
  }
  protected addContent(): HTMLElement {
    const formElement = this.createDOMElement({
      tagName: "form",
      classList: [styles.form, utilitiesStyles.gap20],
    });
    const textareaElement = this.createTextareaElement();
    const cancelButton = this.createCancelButton();

    this.addCloseListener(() => {
      textareaElement.value = EMPTY_STRING;
    });
    const confirmButton = new TextButton(BUTTON_TEXT.CONFIRM).getElement();
    formElement.addEventListener("submit", (event) => {
      this.submitHandler(event, textareaElement);
    });
    formElement.append(textareaElement, cancelButton, confirmButton);
    return formElement;
  }

  private createTextareaElement(): HTMLTextAreaElement {
    const textareaElement = this.createDOMElement({
      tagName: "textarea",
      classList: [styles.input],
    });
    textareaElement.placeholder = PLACEHOLDER.INSTRUCTION;

    textareaElement.rows = TEXTAREA_ROWS;

    textareaElement.cols = TEXTAREA_COLS;
    return textareaElement;
  }

  private createCancelButton(): HTMLButtonElement {
    const cancelButton = new TextButton(BUTTON_TEXT.CANCEL);
    cancelButton.getElement().type = "button";
    cancelButton.addListener(() => {
      this.closeModal();
    });
    return cancelButton.getElement();
  }

  private addCloseListener(callback: Callback): void {
    this.element.addEventListener("close", callback);
  }

  private submitHandler(
    event: SubmitEvent,
    textareaElement: HTMLTextAreaElement,
  ): void {
    event.preventDefault();
    const value = textareaElement.value.trim();
    const optionsList = FileHandler.getInstance().parseCSV(value);
    if (optionsList) {
      this.closeModal();
      this.optionList.setList(optionsList);
    }
  }
}
