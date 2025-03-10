import { BaseComponent } from "@/components/base-component.ts";
import utilitiesStyles from "@/styles/utilities.module.css";
import { OptionList } from "@/components/main/option-list/option-list.ts";
import { TextButton } from "@/components/button/text-button.ts";
import { PasteModal } from "@/components/modal/paste-modal.ts";
import type { Callback } from "@/type";
import { Router } from "@/components/router.ts";
import { FileHandler } from "@/components/file-handler.ts";
import { BUTTON_TEXT, PAGE_PATH } from "@/constants.ts";
import { ValidModal } from "@/components/modal/valid-modal.ts";

export class Main extends BaseComponent<"main"> {
  private static instance: Main | undefined;
  private constructor() {
    super();
  }
  public static getInstance(): Main {
    if (!Main.instance) {
      Main.instance = new Main();
    }
    return Main.instance;
  }
  protected createView(): HTMLElement {
    const main = this.createDOMElement({
      tagName: "main",
      classList: [
        utilitiesStyles.container,
        utilitiesStyles.flex,
        utilitiesStyles.gap30,
        utilitiesStyles.flexColumn,
        utilitiesStyles.alignCenter,
      ],
    });
    const optionList = this.addOptionList();
    const buttons = this.createButtons(optionList);

    main.append(optionList.getElement(), ...buttons);

    return main;
  }

  private createButtons(optionList: OptionList): HTMLButtonElement[] {
    const pasteModal = PasteModal.getInstance(optionList);
    const validModal = ValidModal.getInstance();
    const fileHandler = FileHandler.getInstance();
    const router = Router.getInstance();
    return [
      this.createButton(BUTTON_TEXT.ADD_OPTION, () => optionList.addOption()),
      this.createButton(BUTTON_TEXT.CLEAR_LIST, () => optionList.reset()),
      this.createButton(BUTTON_TEXT.PASTE_LIST, () => pasteModal.showModal()),
      this.createButton(BUTTON_TEXT.SAVE_LIST, () =>
        fileHandler.saveJSON(optionList),
      ),
      this.createButton(BUTTON_TEXT.LOAD_LIST, () =>
        fileHandler.loadJSON(optionList),
      ),
      this.createButton(BUTTON_TEXT.START, () => {
        const data = optionList.filterOption();
        if (data) {
          router.navigateTo(PAGE_PATH.SECOND, data);
        } else {
          validModal.showModal();
        }
      }),
    ];
  }

  private createButton(text: string, callback: Callback): HTMLButtonElement {
    const button = new TextButton(text, callback);
    return button.getElement();
  }

  private addOptionList(): OptionList {
    const optionList = new OptionList();
    optionList.addOption();
    return optionList;
  }
}
