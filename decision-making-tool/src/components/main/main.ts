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
    const optionList = this.addOptionList();
    const addOptionButton = this.createButton("Add Option", () => {
      optionList.addOption();
    });
    const pasteModal = PasteModal.getInstance(optionList);
    const pasteButton = this.createButton("Paste List", () => {
      pasteModal.showModal();
    });

    const clearButton = this.createButton("Clear List", () => {
      optionList.reset();
    });

    const saveButton = this.createButton("Save List to File", () => {
      this.saveListHandler(optionList);
    });

    const loadButton = this.createButton("Load List from File", () => {
      this.loadListHandler(optionList);
    });

    main.append(
      optionList.getElement(),
      addOptionButton,
      clearButton,
      pasteButton,
      saveButton,
      loadButton,
    );

    return main;
  }

  private loadListHandler(optionList: OptionList): void {
    console.log("load");
    const input = this.createDOMElement({
      tagName: "input",
      attributes: { type: "file", accept: ".json" },
    });
    input.addEventListener("change", () => {
      const file = input.files;
      if (!file) {
        throw new Error("Invalid file");
      }
      file[0].text().then((text) => {
        const data = JSON.parse(text);
        if (!optionList.isOptionListValue(data)) {
          throw new Error("Invalid option list");
        }
        optionList.setList(data);
      });
    });
    input.click();
  }

  private saveListHandler(optionList: OptionList): void {
    let blob = new Blob([JSON.stringify(optionList.getList())], {
      type: "application/json",
    });
    let url = URL.createObjectURL(blob);
    let a = this.createDOMElement({
      tagName: "a",
      attributes: { href: url, download: "option-list.json" },
    });
    a.click();
    console.log(url);
    URL.revokeObjectURL(url);
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
