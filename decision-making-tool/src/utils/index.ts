import type { ElementOptions } from "@/type";
import { LS_PREFIX } from "@/constants.ts";

/**
 * Creates and returns a new DOM element with the specified properties.
 * @param {Object} options - The options for creating the DOM element.
 * @param {string} [options.tagName='div'] - The tag name of the element.
 * @param {string[]} [options.classList=[]] - A list of CSS classes to apply to the element.
 * @param {string} [options.textContent=''] - The text content of the element.
 * @param {Object} [options.attributes={}] - A map of attributes to set on the element.
 * @returns {HTMLElement} - The created DOM element.
 */
export function createDOMElement<T extends keyof HTMLElementTagNameMap>({
  tagName,
  classList,
  textContent,
  attributes,
}: ElementOptions<T>): HTMLElementTagNameMap[T] {
  const element = document.createElement(tagName);
  if (classList) {
    element.classList.add(...classList);
  }
  if (textContent) {
    element.textContent = textContent;
  }
  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) =>
      element.setAttribute(key, value),
    );
  }

  return element;
}

export function saveToStorage(key: string, value: string): void {
  const storageKey = LS_PREFIX + key;
  window.localStorage.setItem(storageKey, JSON.stringify(value));
}

export function loadFromStorage(key: string): unknown {
  const storageKey = LS_PREFIX + key;
  const value = window.localStorage.getItem(storageKey);
  if (!value) {
    return null;
  }
  return JSON.parse(value);
}

export function isEmptyLocalStorage(key: string): boolean {
  return !loadFromStorage(key);
}
