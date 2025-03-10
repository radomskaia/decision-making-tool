import { BaseComponent } from "@/components/base-component.ts";
import {
  BUTTON_TITLE,
  ID_PREFIX,
  INITIATION_ID,
} from "@/constants/constants.ts";

export class idElement extends BaseComponent<"div"> {
  protected static id = INITIATION_ID;
  protected static incrementId(): void {
    idElement.id++;
  }
  public static resetId(): void {
    idElement.id = INITIATION_ID;
  }
  public static getId(): number {
    return idElement.id;
  }
  public static setId(id: number): void {
    idElement.id = id;
  }
  private readonly _id: string;
  constructor(value?: string) {
    super();
    this._id = value || `${ID_PREFIX}${idElement.getId()}`;
    this.element.textContent = this._id;
  }

  protected createView(): HTMLDivElement {
    idElement.incrementId();
    return this.createDOMElement({
      tagName: "div",
      attributes: { title: BUTTON_TITLE.ID },
    });
  }

  public get id(): string {
    return this._id;
  }
}
