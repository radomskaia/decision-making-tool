import styles from "./base/button.module.css";

import type { ButtonOptions, CreateSVGIconOptions } from "src/types";
import { BaseButton } from "@/components/buttons/base/base-button.ts";
import { ATTRIBUTES, SVG_CONFIG } from "@/constants/buttons-constants.ts";

export class IconButton extends BaseButton {
  protected useSVGIcon: SVGUseElement | undefined;

  constructor(options: ButtonOptions) {
    super();
    this.appendSVGIcon(options);
  }

  private appendSVGIcon(options: ButtonOptions): void {
    const { path, title } = options;
    if (path) {
      const img = this.createSVGIcon({
        path: path,
        classList: [styles.iconButton],
        attributes: {
          title: title,
          [ATTRIBUTES.ariaLabel]: title,
        },
      });
      this.appendElement(img);
    }
  }

  private createSVGIcon({
    path,
    classList,
    attributes,
  }: CreateSVGIconOptions): SVGSVGElement {
    const svg = document.createElementNS(SVG_CONFIG.NAMESPACE_SVG, "svg");
    if (classList) {
      this.addClassList(classList, svg);
    }
    this.addAttributes({ ...attributes, role: "img" }, svg);
    const use = document.createElementNS(SVG_CONFIG.NAMESPACE_SVG, "use");
    use.setAttributeNS(
      SVG_CONFIG.NAMESPACE_XLINK,
      SVG_CONFIG.QUALIFIED_NAME,
      path,
    );
    this.useSVGIcon = use;
    svg.append(use);
    return svg;
  }
}
