import type { ElementOptions } from "@/type";

export abstract class BaseComponent<
  T extends HTMLElement = HTMLElement,
  O = void,
> {
  protected element: T;
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

  protected addClassList(
    element: HTMLElement | SVGSVGElement,
    classList?: string[],
  ): void {
    if (classList) {
      element.classList.add(...classList);
    }
  }

  protected addAttributes(
    element: HTMLElement | SVGSVGElement,
    attributes?: Record<string, string>,
  ): void {
    if (attributes) {
      for (const [key, value] of Object.entries(attributes)) {
        element.setAttribute(key, value);
      }
    }
  }

  protected addTextContent(element: HTMLElement, textContent?: string): void {
    if (textContent) {
      element.textContent = textContent;
    }
  }

  protected abstract createView(options?: O): T;

  public getElement(): T {
    return this.element;
  }

  protected toggleClass(className: string, isAdd?: boolean): void {
    this.element.classList.toggle(className, isAdd);
  }

  public appendChild(child: HTMLElement): void {
    this.element.append(child);
  }

  public remove(): void {
    this.element.remove();
  }
}
