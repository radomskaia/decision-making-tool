import type { OptionList } from "@/components/main/option-list/option-list.ts";

export class FileHandler {
  private static instance: FileHandler | undefined;
  public static getInstance(): FileHandler {
    if (!FileHandler.instance) {
      FileHandler.instance = new FileHandler();
    }
    return FileHandler.instance;
  }
  public loadJSON(optionList: OptionList): void {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

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

  public saveJSON(optionList: OptionList, filename: string): void {
    let blob = new Blob([JSON.stringify(optionList.getList())], {
      type: "application/json",
    });
    let url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  }
}
