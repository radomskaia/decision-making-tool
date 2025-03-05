import { Button } from "@/components/button/button.ts";
import type { ButtonOptions } from "@/type";
import styles from "@/components/button/button.module.css";

export class ButtonSettings extends Button {
  constructor(
    options: ButtonOptions,
    private readonly pathOn: string,
    private readonly pathOff: string,
  ) {
    super(options);
    this.pathOff = pathOff;
    this.pathOn = pathOn;
    this.addClassList(this.element, [styles.settings]);
  }

  public togglePath(isOn: boolean): void {
    const path = isOn ? this.pathOff : this.pathOn;
    console.log(path);
    this.useSVGIcon?.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "xlink:href",
      path,
    );
  }
}
