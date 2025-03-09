import { BaseComponent } from "@/components/base-component.ts";

export class idElement extends BaseComponent<"div"> {
  protected static id = 0;
  protected static incrementId(): void {
    idElement.id++;
  }
  public static resetId(): void {
    idElement.id = 0;
  }
  public static getId(): number {
    return idElement.id;
  }
  public static setId(id: number): void {
    idElement.id = id;
  }
  private _id: number;
  constructor(value?: number) {
    super();
    this._id = value || idElement.getId();
    this.element.textContent = "#" + this._id.toString();
  }

  protected createView(): HTMLDivElement {
    idElement.incrementId();
    return this.createDOMElement({
      tagName: "div",
      attributes: { title: "ID" },
    });
  }

  public get id(): number {
    return this._id;
  }
}
