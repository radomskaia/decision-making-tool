import { BaseInput } from "@/components/input/base-input.ts";
import { DEFAULT_SETTINGS } from "@/constants/wheel-constants.ts";
import { SYMBOLS } from "@/constants/constants.ts";
import { DURATION_ID, INPUT_TYPES } from "@/constants/input-constants.ts";
import { ICON_PATH, SVG_CONFIG } from "@/constants/buttons-constants.ts";
import styles from "@/pages/decision-picker/decision-picker.module.css";

export class DurationInput extends BaseInput {
  private duration: number = DEFAULT_SETTINGS.DURATION;
  private id: string = DURATION_ID;
  constructor(value?: string) {
    super(value);
    this.element.type = INPUT_TYPES.NUMBER;
    this.element.min = this.duration.toString();
    this.element.autofocus = true;
    this.element.addEventListener("beforeinput", (event) => {
      if (event.data === SYMBOLS.dash) {
        event.preventDefault();
      }
    });
    this.element.id = this.id;
  }

  public disabledElement(isDisabled: boolean): void {
    this.element.disabled = isDisabled;
  }

  public addLabel(label: string, classList?: string[]): HTMLLabelElement {
    const labal = this.createDOMElement({
      tagName: "label",
      classList: classList,
      attributes: {
        for: this.id,
        title: label,
      },
    });

    labal.append(this.createSVGIcon(ICON_PATH.ALARM));

    return labal;
  }

  private createSVGIcon(path: string): SVGSVGElement {
    const svg = document.createElementNS(SVG_CONFIG.NAMESPACE_SVG, "svg");
    this.addAttributes({ role: "img" }, svg);
    svg.classList.add(styles.icon);
    const use = document.createElementNS(SVG_CONFIG.NAMESPACE_SVG, "use");
    use.setAttributeNS(
      SVG_CONFIG.NAMESPACE_XLINK,
      SVG_CONFIG.QUALIFIED_NAME,
      path,
    );
    svg.append(use);
    return svg;
  }
}
