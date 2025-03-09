import { BaseComponent } from "@/components/base-component.ts";
import styles from "@/components/main/option-list/option.module.css";
import type { OptionsList, OptionsValue } from "@/type";
import { InputType } from "@/type";
import { OptionItem } from "@/components/main/option-list/option-item.ts";
import { idElement } from "@/components/main/option-list/id-element.ts";

export class OptionList extends BaseComponent<"ul"> {
  private _list: OptionsList = { lastId: 0, list: [] };
  private inputTypes: InputType[] = [InputType.Title, InputType.Weight];
  constructor(list?: OptionsList) {
    super();
    if (list) {
      this._list = list;
    }
  }
  protected createView(): HTMLElementTagNameMap["ul"] {
    return this.createDOMElement({
      tagName: "ul",
      classList: [styles.optionsList],
    });
  }

  public addOption(optionsValue?: OptionsValue): void {
    const optionItem = new OptionItem(optionsValue);
    this.appendElement(optionItem.getElement());
    const id = idElement.getId();
    optionItem.addListener("button", () => {
      const list = this._list.list;
      const index = this.getOptionIndex(id);
      list.splice(index, 1);
      optionItem.getElement().remove();
    });
    for (const inputType of this.inputTypes) {
      optionItem.addListener(inputType, (event) => {
        if (!event) {
          throw new Error("Where is Event?!");
        }
        this.inputHandler(inputType, id, event);
      });
    }

    if (optionsValue) {
      return;
    }
    this._list.list.push(optionItem.getValue());
    this._list.lastId = id;
  }

  public get list(): OptionsList {
    return structuredClone(this._list);
  }

  public set list(value: OptionsList) {
    if (value.lastId) {
      this.reset();
      this._list = value;
    }

    for (const option of value.list) {
      this.addOption(option);
    }
  }

  public reset(): void {
    this._list = { lastId: 0, list: [] };
    idElement.resetId();
    this.clearElement();
  }

  private getOptionIndex(id: number): number {
    const index = this._list.list.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error("Can't update input value. Didn't find ID in the List");
    }
    return index;
  }

  private inputHandler(type: InputType, id: number, event: Event): void {
    const list = this._list.list;
    const index = this.getOptionIndex(id);
    if (event.target instanceof HTMLInputElement) {
      list[index][type] = event.target.value;
    }
  }
}
