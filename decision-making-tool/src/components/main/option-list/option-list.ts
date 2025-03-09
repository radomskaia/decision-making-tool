import { BaseComponent } from "@/components/base-component.ts";
import styles from "@/components/main/option-list/option.module.css";
import type { OptionListValue, OptionItemValue } from "@/type";
import { InputType } from "@/type";
import { OptionItem } from "@/components/main/option-list/option-item.ts";
import { idElement } from "@/components/main/option-list/id-element.ts";

export class OptionList extends BaseComponent<"ul"> {
  private optionListValue: OptionListValue = { lastId: 0, list: [] };
  private inputTypes: InputType[] = [InputType.Title, InputType.Weight];
  constructor(list?: OptionListValue) {
    super();
    if (list) {
      this.optionListValue = list;
    }
  }
  protected createView(): HTMLElementTagNameMap["ul"] {
    return this.createDOMElement({
      tagName: "ul",
      classList: [styles.optionsList],
    });
  }

  public addOption(optionsValue?: OptionItemValue): void {
    const optionItem = new OptionItem(optionsValue);
    this.appendElement(optionItem.getElement());
    const lastId = idElement.getId();
    const id = `#${lastId}`;
    optionItem.addListener("button", () => {
      const list = this.optionListValue.list;
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

    if (optionsValue?.id) {
      return;
    }
    this.optionListValue.list.push(optionItem.getValue());
    this.optionListValue.lastId = lastId;
  }

  public getList(): OptionListValue {
    return structuredClone(this.optionListValue);
  }

  public setList(value: OptionListValue): void {
    if (value.lastId) {
      this.reset();
      this.optionListValue = value;
    }

    for (const option of value.list) {
      this.addOption(option);
    }
  }

  public reset(): void {
    this.optionListValue = { lastId: 0, list: [] };
    idElement.resetId();
    this.clearElement();
  }

  public isOptionListValue(value: unknown): value is OptionListValue {
    if (typeof value !== "object" || value === null) {
      return false;
    }
    if (!("lastId" in value && "list" in value)) {
      return false;
    }
    if (typeof value.lastId !== "number" || value.lastId < 0) {
      return false;
    }
    if (!Array.isArray(value.list)) {
      return false;
    }
    for (const option of value.list) {
      if (!this.isOptionItemValue(option, value.lastId)) {
        return false;
      }
    }

    return true;
  }

  private isOptionItemValue(
    value: unknown,
    lastId: number,
  ): value is OptionItemValue {
    if (typeof value !== "object" || value === null) {
      return false;
    }
    if (!("id" in value && "title" in value && "weight" in value)) {
      return false;
    }
    if (typeof value.id !== "string" || value.id[0] !== "#") {
      return false;
    }
    let id = Number(value.id.slice(1));
    if (Number.isNaN(id) || id < 0 || id > lastId) {
      return false;
    }
    const weight = value.weight === "" ? value.weight : Number(value.weight);

    if (typeof weight === "number" && Number.isNaN(weight) && weight <= 0) {
      return false;
    }
    const title = value.title;
    if (typeof title !== "string") {
      return false;
    }
    return true;
  }

  private getOptionIndex(id: string): number {
    const index = this.optionListValue.list.findIndex((item) => {
      return item.id === id;
    });
    if (index === -1) {
      throw new Error("Can't update input value. Didn't find ID in the List");
    }
    return index;
  }

  private inputHandler(type: InputType, id: string, event: Event): void {
    const list = this.optionListValue.list;
    const index = this.getOptionIndex(id);
    if (event.target instanceof HTMLInputElement) {
      list[index][type] = event.target.value;
    }
  }
}
