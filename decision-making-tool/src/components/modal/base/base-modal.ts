import { BaseComponent } from "@/components/base-component.ts";
import utilitiesStyles from "@/styles/utilities.module.css";
import styles from "@/components/modal/base/modal.module.css";

export abstract class BaseModal extends BaseComponent<"dialog"> {
  private readonly modalWrapper: HTMLDivElement;

  protected constructor() {
    super();
    this.modalWrapper = this.addWrapper();
    this.modalWrapper.append(this.addContent());
  }

  protected createView(): HTMLElementTagNameMap["dialog"] {
    const modal = this.createDOMElement({
      tagName: "dialog",
      classList: [styles.modal],
    });
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        this.closeModal();
      }
    });
    return modal;
  }

  public showModal(): void {
    document.body.append(this.element);
    this.element.showModal();
  }

  public closeModal(): void {
    this.element.close();
    this.element.remove();
  }

  protected abstract addContent(): HTMLElement;

  protected addWrapper(): HTMLDivElement {
    const modalWrapper = this.createDOMElement({
      tagName: "div",
      classList: [
        styles.wrapper,
        utilitiesStyles.flex,
        utilitiesStyles.flexColumn,
        utilitiesStyles.alignCenter,
        utilitiesStyles.gap20,
      ],
    });
    this.element.append(modalWrapper);
    return modalWrapper;
  }
}
