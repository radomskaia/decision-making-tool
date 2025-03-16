export type Callback = () => void;
export type CallbackEvent = (option?: Event) => void;
export type ToggleViewState = (isEnd: boolean) => void;

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
  id?: string;
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

export enum StorageKeys {
  optionListValue = "optionListValue",
  soundSettings = "soundSettings",
}

export interface Route {
  path: string;
  component: {
    getInstance(): {
      getElement(): HTMLElement;
    };
  };
}

export interface SectorData {
  startAngle: number;
  angle: number;
  color: string;
  rgbArray: number[];
  title: string;
  isTitle: boolean;
}

export type UpdateSector = (
  startAngle: number,
  angle: number,
  title: string,
) => void;

export interface AnimationData {
  offset: number;
  updateSector: UpdateSector;
  angle: number;
}

export type DrawSectors = (
  sectorData: SectorData[],
  colors: MainWheelColors,
  options?: AnimationData,
) => void;

export type DrawSector = (
  startAngle: number,
  angle: number,
  color: string,
  strokeColor: string,
) => void;

export type DrawText = (
  text: string,
  x: number,
  y: number,
  angle: number,
  strokeColor: string,
) => void;

export enum AudioName {
  strike = "strike",
  end = "end",
}

export interface MainWheelColors {
  cursor: string;
  stroke: string;
}

export interface WheelColors extends MainWheelColors {
  thinner: number;
}
