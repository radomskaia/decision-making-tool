import { ButtonSettings } from "@/components/button/button-settings.ts";
import { BUTTON_TITLE } from "@/constants.ts";

export class ThemeButton extends ButtonSettings {
  protected readonly pathOn: string;
  protected readonly pathOff = "#theme-dark";
  protected readonly title: string;

  constructor() {
    const path = "#theme-light";
    const title = BUTTON_TITLE.THEME;
    super({
      path,
      title,
    });
    this.title = title;
    this.pathOn = path;
  }
}
