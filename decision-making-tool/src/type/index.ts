export type Callback = () => void;

export type TypeGuard<T> = (value: unknown) => value is T;

export interface ElementOptions<T> {
  tagName: T;
  classList?: string[];
  textContent?: string;
  attributes?: Record<string, string>;
}
