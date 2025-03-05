import styles from "./button.module.css";

import type { ButtonOptions, CreateSVGIconOptions } from "@/type";
import { createDOMElement } from "@/utils";
import { BaseComponent } from "@/components/base-component.ts";

export class Button extends BaseComponent<HTMLButtonElement, ButtonOptions> {
  protected useSVGIcon: SVGUseElement | undefined;
  // protected svgIcon: SVGSVGElement | undefined;
  protected createView({ title, path }: ButtonOptions): HTMLButtonElement {
    const button = createDOMElement({
      tagName: "button",
      classList: [styles.button],
    });
    if (path) {
      const iconPath = this.ICON_PATH + path;
      const img = this.createSVGIcon({
        path: iconPath,
        classList: [styles.iconButton],
        attributes: {
          title: title,
          "aria-label": title,
        },
      });
      button.append(img);
    }

    return button;
  }

  private createSVGIcon({
    path,
    classList,
    attributes,
  }: CreateSVGIconOptions): SVGSVGElement {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.addClassList(svg, classList);
    this.addAttributes(svg, { ...attributes, role: "img" });
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", path);
    this.useSVGIcon = use;
    svg.append(use);
    return svg;
  }

  public buttonDisabled(isDisabled: boolean): void {
    this.element.disabled = isDisabled;
  }
}
