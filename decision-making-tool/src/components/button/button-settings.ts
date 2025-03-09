import type { ButtonOptions } from "@/type";
import styles from "@/components/button/button.module.css";
import type { SettingsAction } from "@/components/settings-action.ts";
import { IconButton } from "@/components/button/icon-button.ts";

export abstract class ButtonSettings extends IconButton {
  protected abstract pathOff: string;
  protected abstract pathOn: string;
  protected abstract title: string;

  protected constructor(options: ButtonOptions) {
    super(options);
    this.addClassList(this.element, [styles.settings]);
  }

  public togglePath(isOn: boolean): void {
    const path = isOn ? this.pathOff : this.pathOn;
    this.useSVGIcon?.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "xlink:href",
      path,
    );
  }

  public addToggleListener(action: SettingsAction): void {
    this.addListener(() => {
      action.toggle();
    });
  }
}
