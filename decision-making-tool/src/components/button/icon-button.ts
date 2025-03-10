import styles from "./button.module.css";

import { Button } from "@/components/button/button.ts";
import type { ButtonOptions, CreateSVGIconOptions } from "@/type";

export class IconButton extends Button {
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
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.addClassList(svg, classList);
    this.addAttributes(svg, { ...attributes, role: "img" });
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", path);
    this.useSVGIcon = use;
    svg.append(use);
    return svg;
  }
}
