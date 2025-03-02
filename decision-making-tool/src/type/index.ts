export type Callback = () => void;

export interface ElementOptions<T> {
  tagName: T;
  classList?: string[];
  textContent?: string;
  attributes?: Record<string, string>;
}
