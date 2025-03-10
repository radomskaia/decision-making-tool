import type { OptionList } from "@/components/main/option-list/option-list.ts";
import { Validator } from "@/components/validator.ts";
import { ERROR_MESSAGES, FILE_CONFIG } from "@/constants.ts";

export class FileHandler {
  private static instance: FileHandler | undefined;
  private readonly initialized: boolean;
  private constructor() {
    this.initialized = true;
  }
  public static getInstance(): FileHandler {
    if (!FileHandler.instance) {
      FileHandler.instance = new FileHandler();
    }
    return FileHandler.instance;
  }
  public loadJSON(optionList: OptionList): void {
    if (!this.initialized) {
      throw new Error(ERROR_MESSAGES.NOT_INITIALIZED);
    }
    const input = document.createElement("input");
    input.type = "file";
    input.accept = FILE_CONFIG.EXTENSION;

    input.addEventListener("change", () => {
      const file = input.files;
      if (!file) {
        throw new Error(ERROR_MESSAGES.INVALID_FILE);
      }
      file[0].text().then((text) => {
        const data = JSON.parse(text);
        if (!Validator.getInstance().isOptionListValue(data)) {
          throw new Error(ERROR_MESSAGES.INVALID_LIST);
        }
        optionList.setList(data);
      });
    });
    input.click();
  }

  public saveJSON(optionList: OptionList): void {
    let blob = new Blob([JSON.stringify(optionList.getList())], {
      type: FILE_CONFIG.TYPE,
    });
    let url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = FILE_CONFIG.NAME;
    link.click();

    URL.revokeObjectURL(url);
  }
}
