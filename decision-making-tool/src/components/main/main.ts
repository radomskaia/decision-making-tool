import { BaseComponent } from "@/components/base-component.ts";
import utilitiesStyles from "@/styles/utilities.module.css";
import { OptionList } from "@/components/main/option-list/option-list.ts";
import { TextButton } from "@/components/button/text-button.ts";
import { PasteModal } from "@/components/modal/paste-modal.ts";
import type { Callback } from "@/type";
import { Router } from "@/components/router.ts";
import { FileHandler } from "@/components/file-handler.ts";
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
    const fileHandler = new FileHandler();
    return [
      this.createButton("Add Option", () => optionList.addOption()),
      this.createButton("Clear List", () => optionList.reset()),
      this.createButton("Paste List", () => pasteModal.showModal()),
      this.createButton("Save List to File", () =>
        fileHandler.saveJSON(optionList, "option-list.json"),
      ),
      this.createButton("Load List from File", () =>
        fileHandler.loadJSON(optionList),
      ),
      this.createButton("Start", () =>
        Router.getInstance().navigateTo("/decision-picker"),
      ),
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
