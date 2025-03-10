import type { ElementOptions, TypeGuard } from "src/types";
import { LS_PREFIX } from "@/constants/constants.ts";

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
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
  }

  return element;
}

export function saveToStorage(key: string, value: object): void {
  const storageKey = LS_PREFIX + key;
  globalThis.localStorage.setItem(storageKey, JSON.stringify(value));
}

export function loadFromStorage<T>(
  key: string,
  typeGuard: TypeGuard<T>,
): T | null {
  const storageKey = LS_PREFIX + key;
  const value = globalThis.localStorage.getItem(storageKey);
  if (!value) {
    return null;
  }
  try {
    const result = JSON.parse(value);
    return typeGuard(result) ? result : null;
  } catch {
    return null;
  }
}

export function isEmptyLocalStorage<T>(
  key: string,
  typeGuard: TypeGuard<T>,
): boolean {
  return loadFromStorage<T>(key, typeGuard) === null;
}
