import type { ElementOptions } from "src/types";

export abstract class BaseComponent<
  T extends keyof HTMLElementTagNameMap,
  O = void,
> {
  protected element: HTMLElementTagNameMap[T];
  protected constructor(options?: O) {
    this.element = this.createView(options);
  }

  protected createDOMElement<T extends keyof HTMLElementTagNameMap>({
    tagName,
    classList,
    textContent,
    attributes,
  }: ElementOptions<T>): HTMLElementTagNameMap[T] {
    const element = document.createElement(tagName);
    this.addClassList(element, classList);
    this.addTextContent(element, textContent);
    this.addAttributes(element, attributes);

    return element;
  }

  protected addClassList(element: Element, classList?: string[]): void {
    if (classList) {
      element.classList.add(...classList);
    }
  }

  protected addAttributes(
    element: Element,
    attributes?: Record<string, string>,
  ): void {
    if (attributes) {
      for (const [key, value] of Object.entries(attributes)) {
        element.setAttribute(key, value);
      }
    }
  }

  protected addTextContent(element: Element, textContent?: string): void {
    if (textContent) {
      element.textContent = textContent;
    }
  }

  protected abstract createView(options?: O): HTMLElementTagNameMap[T];

  public getElement(): HTMLElementTagNameMap[T] {
    return this.element;
  }

  protected toggleClass(className: string, isAdd?: boolean): void {
    this.element.classList.toggle(className, isAdd);
  }

  public appendElement(...child: Element[]): void {
    this.element.append(...child);
  }

  public clearElement(): void {
    this.element.replaceChildren();
  }
}
