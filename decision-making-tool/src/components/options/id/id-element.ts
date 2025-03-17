import { BaseComponent } from "@/components/base-component.ts";
import { ID_PREFIX, INITIATION_ID } from "@/constants/options-constants.ts";
import { BUTTON_TITLE } from "@/constants/buttons-constants.ts";

export class idElement extends BaseComponent<"div"> {
  protected static id = INITIATION_ID;
  private readonly _id: string;
  constructor(value?: string) {
    super();
    this._id = value || `${ID_PREFIX}${idElement.getId()}`;
    this.element.textContent = this._id;
  }
  public get id(): string {
    return this._id;
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

  protected static incrementId(): void {
    idElement.id++;
  }

  protected createView(): HTMLDivElement {
    idElement.incrementId();
    return this.createDOMElement({
      tagName: "div",
      attributes: { title: BUTTON_TITLE.ID },
    });
  }
}
