import styles from "./base/button.module.css";

import type { ButtonOptions, CreateSVGIconOptions } from "src/types";
import { BaseButton } from "@/components/buttons/base/base-button.ts";
import { SVG_CONFIG } from "@/constants/constants.ts";

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
          "aria-label": title,
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
    this.addClassList(svg, classList);
    this.addAttributes(svg, { ...attributes, role: "img" });
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
