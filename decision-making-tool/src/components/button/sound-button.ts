import { ButtonSettings } from "@/components/button/button-settings.ts";
import { BUTTON_TITLE } from "@/constants.ts";

export class SoundButton extends ButtonSettings {
  protected readonly pathOn: string;
  protected readonly pathOff = "#sound-off";
  protected readonly title: string;

  constructor() {
    const path = "#sound-on";
    const title = BUTTON_TITLE.VOLUME;
    super({
      path,
      title,
    });
    this.title = title;
    this.pathOn = path;
  }
}
