export type Callback = (event?: Event) => void;

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
  title: string;
  path?: string;
}

export interface CreateSVGIconOptions extends Options {
  path: string;
}

export interface OptionItemValue {
  id?: number;
  title: string;
  weight: string;
}

export interface OptionListValue {
  lastId?: number;
  list: OptionItemValue[];
}

export enum InputType {
  Title = "title",
  Weight = "weight",
}
