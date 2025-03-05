export type Callback = () => void;

export type TypeGuard<T> = (value: unknown) => value is T;

interface Options {
  classList?: string[];
  attributes?: Record<string, string>;
}

export interface ElementOptions<T> extends Options {
  tagName: T;
  textContent?: string;
}

export interface ButtonOptions {
  // callback: Callback;
  title: string;
  path?: string;
}

export interface HeaderSetting extends ButtonOptions {
  pathOff: string;
}

export interface CreateSVGIconOptions extends Options {
  path: string;
}
