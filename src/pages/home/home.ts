import { BaseComponent } from "@/components/base-component.ts";
import utilitiesStyles from "@/styles/utilities.module.css";
import { OptionList } from "@/components/options/option-list/option-list.ts";
import { PasteModal } from "@/components/modal/paste-modal.ts";
import { Router } from "@/services/router.ts";
import { FileHandler } from "@/services/file-handler.ts";
import { PAGE_PATH, ZERO } from "@/constants/constants.ts";
import { ValidModal } from "@/components/modal/valid-modal.ts";
import type { Callback } from "@/types";
import { StorageKeys } from "@/types";
import { LocalStorage } from "@/services/local-storage.ts";
import { Validator } from "@/services/validator.ts";
import { BUTTON_TEXT, ICON_PATH } from "@/constants/buttons-constants.ts";
import { IconButton } from "@/components/buttons/icon-button.ts";
import styles from "@/pages/home/home.module.css";
import { checkBottom, debounce } from "@/utilities/utilities.ts";

export class Home extends BaseComponent<"main"> {
  private static instance: Home | undefined;
  private readonly buttonsConfig: {
    title: (typeof BUTTON_TEXT)[keyof typeof BUTTON_TEXT];
    path: (typeof ICON_PATH)[keyof typeof ICON_PATH];
    callback: Callback;
  }[] = [
    {
      title: BUTTON_TEXT.ADD_OPTION,
      path: ICON_PATH.ADD,
      callback: (): void => {
        this.optionList.addOption();
        window.scrollTo(ZERO, document.body.scrollHeight);
      },
    },
    {
      title: BUTTON_TEXT.CLEAR_LIST,
      path: ICON_PATH.CLEAR,
      callback: () => this.optionList.reset(),
    },
    {
      title: BUTTON_TEXT.PASTE_LIST,
      path: ICON_PATH.PASTE,
      callback: () => PasteModal.getInstance(this.optionList).showModal(),
    },
    {
      title: BUTTON_TEXT.SAVE_LIST,
      path: ICON_PATH.SAVE,
      callback: () => FileHandler.getInstance().saveJSON(this.optionList),
    },
    {
      title: BUTTON_TEXT.LOAD_LIST,
      path: ICON_PATH.LOAD,
      callback: () => FileHandler.getInstance().loadJSON(this.optionList),
    },
    {
      title: BUTTON_TEXT.START,
      path: ICON_PATH.PLAY,
      callback: (): void => {
        const data = this.optionList.getList();
        if (Validator.isOptionsCountValid(data)) {
          Router.getInstance().navigateTo(PAGE_PATH.DECISION_PICKER);
        } else {
          ValidModal.getInstance().showModal();
        }
      },
    },
  ];
  private readonly optionList: OptionList;
  private buttonWrapper: HTMLDivElement;
  private constructor() {
    super();
    this.optionList = new OptionList();
    this.optionList.init();
    this.appendElement(this.optionList.getElement());
    this.buttonWrapper = this.createButtonWrapper();
    this.addScrollListener();
  }

  public static getInstance(): Home {
    if (!Home.instance) {
      Home.instance = new Home();
    }
    return Home.instance;
  }

  public saveToLocalStorage(): void {
    LocalStorage.getInstance().save(
      StorageKeys.optionListValue,
      this.optionList.getList(),
    );
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

  private addButtons(buttonWrapper: HTMLDivElement): void {
    for (const { title, path, callback } of this.buttonsConfig) {
      const button = new IconButton(
        { title: title, path: `${path}` },
        callback,
      );
      buttonWrapper.append(button.getElement());
    }
  }

  private createButtonWrapper(): HTMLDivElement {
    const buttonWrapper = this.createDOMElement({
      tagName: "div",
      classList: [
        styles.buttonWrapper,
        utilitiesStyles.flex,
        utilitiesStyles.alignCenter,
        utilitiesStyles.justifyBetween,
        utilitiesStyles.flexWrap
      ],
    });
    this.addButtons(buttonWrapper);
    this.appendElement(buttonWrapper);
    return buttonWrapper;
  }

  private addScrollListener(): void {
    window.addEventListener(
      "scroll",
      debounce((): void => {
        this.buttonWrapper.classList.toggle(styles.highlight, checkBottom());
      }),
    );
  }
}
