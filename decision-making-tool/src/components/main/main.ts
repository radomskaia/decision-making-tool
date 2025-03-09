import { BaseComponent } from "@/components/base-component.ts";
import utilitiesStyles from "@/styles/utilities.module.css";
import { OptionList } from "@/components/main/option-list/option-list.ts";
import { TextButton } from "@/components/button/text-button.ts";
import { PasteModal } from "@/components/modal/paste-modal.ts";
import type { Callback } from "@/type";
export class Main extends BaseComponent<"main"> {
  public get check(): boolean {
    return this._check;
  }
  private readonly _check: boolean;
  constructor() {
    super();
    this._check = true;
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
    const ul = this.addOptionList();
    const addOptionButton = this.createButton("Add Option", () => {
      ul.addOption();
    });
    const pasteModal = PasteModal.getInstance(ul);
    const pasteButton = this.createButton("Paste List", () => {
      pasteModal.showModal();
    });

    const clearButton = this.createButton("Clear List", () => {
      ul.reset();
    });

    main.append(ul.getElement(), addOptionButton, clearButton, pasteButton);

    return main;
  }

  private createButton(text: string, callback: Callback): HTMLButtonElement {
    const button = new TextButton(text);
    button.addListener(callback);
    return button.getElement();
  }

  private addOptionList(): OptionList {
    const ul = new OptionList();
    ul.addOption();
    return ul;
  }
}
