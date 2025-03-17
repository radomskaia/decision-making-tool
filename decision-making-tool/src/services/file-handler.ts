import type { OptionList } from "@/components/options/option-list/option-list.ts";
import { Validator } from "@/services/validator.ts";
import {
  MESSAGES,
  FILE_CONFIG,
  FIRST_INDEX,
  SYMBOLS,
  HALF,
} from "@/constants/constants.ts";
import type { OptionItemValue, OptionListValue } from "@/types";
import { StorageKeys } from "@/types";
import { LocalStorage } from "@/services/local-storage.ts";

export class FileHandler {
  private static instance: FileHandler | undefined;
  private readonly validator: Validator;
  private readonly separator: typeof SYMBOLS;
  private config: typeof FILE_CONFIG;

  private constructor() {
    this.validator = Validator.getInstance();
    this.separator = SYMBOLS;
    this.config = FILE_CONFIG;
  }
  public static getInstance(): FileHandler {
    if (!FileHandler.instance) {
      FileHandler.instance = new FileHandler();
    }
    return FileHandler.instance;
  }

  public loadJSON(optionList: OptionList): void {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = this.config.EXTENSION;

    input.addEventListener("change", () => {
      const file = input.files;
      if (!file) {
        throw new Error(MESSAGES.INVALID_FILE);
      }
      file[FIRST_INDEX].text().then((text) => {
        const data = JSON.parse(text);
        if (!this.validator.isOptionListValue(data)) {
          throw new Error(MESSAGES.INVALID_LIST);
        }
        optionList.setList(data);
      });
    });
    input.click();
  }

  public saveJSON(optionList: OptionList): void {
    let blob = new Blob([JSON.stringify(optionList.getList())], {
      type: this.config.TYPE,
    });
    let url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = this.config.NAME;
    link.click();

    URL.revokeObjectURL(url);
  }

  public parseCSV(value: string): OptionListValue | null {
    const splitValue = value.split(this.separator.line);
    const optionListValue: OptionListValue = {
      list: [],
    };
    for (const line of splitValue) {
      const splitItem = line.split(this.separator.comma);
      const lastItem = splitItem.pop()?.trim();
      if (!lastItem || !Validator.isValidWeight(lastItem)) {
        continue;
      }

      const title = splitItem.join(this.separator.comma).trim();
      if (!title) {
        continue;
      }
      const option = {
        title,
        weight: lastItem,
      };
      optionListValue.list.push(option);
    }
    if (!Validator.isPositiveNumber(optionListValue.list.length)) {
      return null;
    }
    return optionListValue;
  }

  public loadLSData(): OptionItemValue[] | null {
    const lsData = LocalStorage.getInstance().load(
      StorageKeys.optionListValue,
      this.validator.isOptionListValue.bind(Validator.getInstance()),
    );
    if (!lsData) {
      return null;
    }
    const data = lsData.list.filter((element) =>
      Validator.isValidOption(element),
    );
    if (!Validator.hasMinimumOptions(data)) {
      return null;
    }
    return [...data].sort(() => Math.random() - HALF);
  }
}
