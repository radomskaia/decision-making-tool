import type { OptionListValue } from "@/type";
const MINIMUM_ITEM_PARTS = 2;

export class PasteList {
  public createOptionList(value: string): OptionListValue | null {
    const splitValue = value.split("\n");
    const optionsList: OptionListValue = {
      list: [],
    };
    for (const item of splitValue) {
      const splitItem = item.split(",");
      const length = splitItem.length;

      if (length < MINIMUM_ITEM_PARTS) {
        continue;
      }
      const weight = Number(splitItem[length - 1].trim());
      if (Number.isNaN(weight) || weight < 0) {
        continue;
      }
      splitItem.pop();
      const title = splitItem.join(",").trim();
      if (title === "") {
        continue;
      }
      const option = {
        title: title,
        weight: weight.toString(),
      };
      optionsList.list.push(option);
    }
    if (optionsList.list.length === 0) {
      return null;
    }
    return optionsList;
  }
}
