import type { OptionItemValue, OptionListValue } from "@/types";
import { StorageKeys } from "@/types";
import { InputType } from "@/types";
import { BaseComponent } from "@/components/base-component.ts";
import styles from "@/components/options/option.module.css";
import { OptionItem } from "@/components/options/option-item/option-item.ts";
import { idElement } from "@/components/options/id/id-element.ts";
import {
  MESSAGES,
  ID_PREFIX,
  INITIATION_ID,
  NOT_FOUND_INDEX,
  REMOVE_ONE_ITEM,
  ZERO,
} from "@/constants/constants.ts";
import { LocalStorage } from "@/services/local-storage.ts";
import { Validator } from "@/services/validator.ts";

export class OptionList extends BaseComponent<"ul"> {
  private optionListValue: OptionListValue = {
    lastId: INITIATION_ID,
    list: [],
  };
  private inputTypes: InputType[] = [InputType.Title, InputType.Weight];
  constructor(list?: OptionListValue) {
    super();
    if (list) {
      this.optionListValue = list;
    }
    window.addEventListener("beforeunload", () => {
      if (document.activeElement instanceof HTMLInputElement) {
        document.activeElement.blur();
      }
      LocalStorage.getInstance().save(
        StorageKeys.optionListValue,
        this.optionListValue,
      );
    });
  }
  public init(): void {
    const lsData = LocalStorage.getInstance().load(
      StorageKeys.optionListValue,
      Validator.getInstance().isOptionListValue.bind(Validator.getInstance()),
    );
    if (lsData === null) {
      this.addOption();
    } else {
      this.setList(lsData);
    }
  }

  public addOption(optionsValue?: OptionItemValue): void {
    const optionItem = new OptionItem(optionsValue);
    this.appendElement(optionItem.getElement());
    const lastId = idElement.getId();
    const id = `${ID_PREFIX}${lastId}`;

    optionItem.addListener("button", () => {
      this.deleteOption(id, optionItem);
    });

    for (const inputType of this.inputTypes) {
      optionItem.addListener(inputType, (event) => {
        if (!event) {
          throw new Error(MESSAGES.NOT_EVENT);
        }
        this.inputHandler(inputType, id, event);
      });
    }

    if (optionsValue?.id) {
      return;
    }

    this.updateList(optionItem.getValue(), lastId);
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
    this.optionListValue.lastId = INITIATION_ID;
    this.optionListValue.list = [];
    idElement.resetId();
    this.clearElement();
  }

  protected createView(): HTMLElementTagNameMap["ul"] {
    return this.createDOMElement({
      tagName: "ul",
      classList: [styles.optionsList],
    });
  }

  private updateList(item: OptionItemValue, lastId: number): void {
    this.optionListValue.list.push(item);
    this.optionListValue.lastId = lastId;
  }

  private deleteOption(id: string, optionItem: OptionItem): void {
    const index = this.getOptionIndex(id);
    this.optionListValue.list.splice(index, REMOVE_ONE_ITEM);
    optionItem.getElement().remove();
    if (this.optionListValue.list.length === ZERO) {
      this.reset();
    }
  }

  private getOptionIndex(id: string): number {
    const index = this.optionListValue.list.findIndex((item) => {
      return item.id === id;
    });
    if (index === NOT_FOUND_INDEX) {
      throw new Error(MESSAGES.ID_NOT_FOUND);
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
