import { BaseComponent } from "@/components/base-component.ts";
import utilitiesStyles from "@/styles/utilities.module.css";
import { OptionList } from "@/components/main/option-list/option-list.ts";
import { TextButton } from "@/components/button/text-button.ts";
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
    const ul = new OptionList();
    ul.addOption();
    const addOptionButton = new TextButton("Add Option");
    addOptionButton.addListener(() => {
      ul.addOption();
      console.log(ul.list);
    });
    const clearListButton = new TextButton("Clear List");
    clearListButton.addListener(() => {
      ul.reset();
    });
    main.append(
      ul.getElement(),
      addOptionButton.getElement(),
      clearListButton.getElement(),
    );
    return main;
  }
}
