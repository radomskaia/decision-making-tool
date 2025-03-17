import { BaseComponent } from "@/components/base-component.ts";
import utilitiesStyles from "@/styles/utilities.module.css";
import { OptionList } from "@/components/options/option-list/option-list.ts";
import { TextButton } from "@/components/buttons/text-button.ts";
import { PasteModal } from "@/components/modal/paste-modal.ts";
import { Router } from "@/services/router.ts";
import { FileHandler } from "@/services/file-handler.ts";
import { PAGE_PATH } from "@/constants/constants.ts";
import { ValidModal } from "@/components/modal/valid-modal.ts";
import type { Callback } from "@/types";
import { StorageKeys } from "@/types";
import { LocalStorage } from "@/services/local-storage.ts";
import { Validator } from "@/services/validator.ts";
import { BUTTON_TEXT } from "@/constants/buttons-constants.ts";

export class Home extends BaseComponent<"main"> {
  private static instance: Home | undefined;
  private readonly buttonsConfig: {
    text: (typeof BUTTON_TEXT)[keyof typeof BUTTON_TEXT];
    callback: Callback;
  }[] = [
    {
      text: BUTTON_TEXT.ADD_OPTION,
      callback: () => this.optionList.addOption(),
    },
    {
      text: BUTTON_TEXT.CLEAR_LIST,
      callback: () => this.optionList.reset(),
    },
    {
      text: BUTTON_TEXT.PASTE_LIST,
      callback: () => PasteModal.getInstance(this.optionList).showModal(),
    },
    {
      text: BUTTON_TEXT.SAVE_LIST,
      callback: () => FileHandler.getInstance().saveJSON(this.optionList),
    },
    {
      text: BUTTON_TEXT.LOAD_LIST,
      callback: () => FileHandler.getInstance().loadJSON(this.optionList),
    },
    {
      text: BUTTON_TEXT.START,
      callback: (): void => {
        const data = this.optionList.getList();
        if (Validator.isOptionsCountValid(data)) {
          LocalStorage.getInstance().save(StorageKeys.optionListValue, data);
          Router.getInstance().navigateTo(PAGE_PATH.DECISION_PICKER);
        } else {
          ValidModal.getInstance().showModal();
        }
      },
    },
  ];
  private readonly optionList: OptionList;
  private constructor() {
    super();
    this.optionList = new OptionList();
    this.optionList.init();
    this.appendElement(this.optionList.getElement());
    this.addButtons();
  }
  public static getInstance(): Home {
    if (!Home.instance) {
      Home.instance = new Home();
    }
    return Home.instance;
  }
  protected createView(): HTMLElement {
    return this.createDOMElement({
      tagName: "main",
      classList: [
        utilitiesStyles.container,
        utilitiesStyles.flex,
        utilitiesStyles.gap30,
        utilitiesStyles.flexColumn,
        utilitiesStyles.alignCenter,
      ],
    });
  }

  private addButtons(): void {
    for (const { text, callback } of this.buttonsConfig) {
      const button = new TextButton(text, callback);
      this.appendElement(button.getElement());
    }
  }
}
