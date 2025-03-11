import type { OptionList } from "@/components/options/option-list/option-list.ts";
import { Validator } from "@/services/validator.ts";
import {
  ERROR_MESSAGES,
  FILE_CONFIG,
  PASTE_SEPARATOR,
} from "@/constants/constants.ts";
import type { OptionListValue } from "@/types";

export class FileHandler {
  private static instance: FileHandler | undefined;
  private readonly validator: Validator;
  private readonly separator: typeof PASTE_SEPARATOR;
  private config: typeof FILE_CONFIG;

  private constructor() {
    this.validator = Validator.getInstance();
    this.separator = PASTE_SEPARATOR;
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
        throw new Error(ERROR_MESSAGES.INVALID_FILE);
      }
      file[0].text().then((text) => {
        const data = JSON.parse(text);
        if (!this.validator.isOptionListValue(data)) {
          throw new Error(ERROR_MESSAGES.INVALID_LIST);
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
}
