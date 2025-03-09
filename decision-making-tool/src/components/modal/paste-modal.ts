import { Modal } from "@/components/modal/modal.ts";
import { TextButton } from "@/components/button/text-button.ts";
import styles from "@/components/modal/modal.module.css";
import utilitiesStyles from "@/styles/utilities.module.css";
import type { Callback, OptionListValue } from "@/type";
import type { OptionList } from "@/components/main/option-list/option-list.ts";
const TEXTAREA_PLACEHOLDER = `
Paste a list of new options in a CSV-like format:

title,weight(number)              -> | title                           |weight|
title,1                           -> | title                           | 1 |
title with whitespace,2           -> | title with whitespace           | 2 |
title , with , commas,3           -> | title , with , commas           | 3 |
title with &quot;quotes&quot;,4   -> | title with &quot;quotes&quot;   | 4 |
`;
const TEXTAREA_ROWS = 15;
const TEXTAREA_COLS = 80;

export class PasteModal extends Modal {
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
      throw new Error("PasteModal is not initialized");
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
      textareaElement.value = "";
    });
    const confirmButton = new TextButton("Confirm").getElement();
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
    textareaElement.placeholder = TEXTAREA_PLACEHOLDER;

    textareaElement.rows = TEXTAREA_ROWS;

    textareaElement.cols = TEXTAREA_COLS;
    return textareaElement;
  }

  private createCancelButton(): HTMLButtonElement {
    const cancelButton = new TextButton("Cancel");
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
    const optionsList = this.createOptionList(value);
    if (optionsList) {
      this.closeModal();
      this.optionList.setList(optionsList);
    }
  }

  private createOptionList(value: string): OptionListValue | null {
    const splitValue = value.split("\n");
    const optionListValue: OptionListValue = {
      list: [],
    };
    for (const item of splitValue) {
      const splitItem = item.split(",");
      const lastItem = splitItem.pop();
      if (!lastItem) {
        continue;
      }
      const weight = Number(lastItem.trim());
      if (Number.isNaN(weight) || weight <= 0) {
        continue;
      }
      const title = splitItem.join(",").trim();
      if (!title) {
        continue;
      }
      const option = {
        title: title,
        weight: weight.toString(),
      };
      optionListValue.list.push(option);
    }
    if (optionListValue.list.length === 0) {
      return null;
    }
    return optionListValue;
  }
}
