import type { ButtonSettings } from "@/components/button/button-settings.ts";
import type { SettingsAction } from "@/components/settings-action.ts";

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
  title: string;
  path?: string;
}

export interface CreateSVGIconOptions extends Options {
  path: string;
}

export interface settingsButtons {
  button: ButtonSettings;
  action: SettingsAction;
}
