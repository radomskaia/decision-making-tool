import type { OptionItemValue, OptionListValue } from "@/type";

export const OPTION_KEYS = {
  ID: "id",
  TITLE: "title",
  WEIGHT: "weight",
} as const;

export const OPTION_LIST_KEYS = {
  LAST_ID: "lastId",
  LIST: "list",
} as const;

export class Validator {
  private static instance: Validator | undefined;
  private constructor(
    private itemKeys = OPTION_KEYS,
    private listKeys = OPTION_LIST_KEYS,
  ) {}
  public static getInstance(): Validator {
    if (!Validator.instance) {
      Validator.instance = new Validator();
    }
    return Validator.instance;
  }
  public isOptionListValue(value: unknown): value is OptionListValue {
    if (
      !(
        this.isList(value) &&
        this.isLastId(value.lastId) &&
        Array.isArray(value.list)
      )
    ) {
      return false;
    }
    for (const option of value.list) {
      if (!this.isOptionItemValue(option, value.lastId)) {
        return false;
      }
    }

    return true;
  }

  private isOptionItemValue(
    value: unknown,
    lastId: number,
  ): value is OptionItemValue {
    return (
      this.isOption(value) &&
      this.isOptionId(value.id, lastId) &&
      this.isOptionWeight(value.weight) &&
      this.isOptionTitle(value.title)
    );
  }

  private isList(value: unknown): value is OptionListValue {
    if (!this.isObject(value)) {
      return false;
    }
    return this.listKeys.LAST_ID in value && this.listKeys.LIST in value;
  }

  private isOption(value: unknown): value is OptionItemValue {
    if (!this.isObject(value)) {
      return false;
    }
    return (
      this.itemKeys.ID in value &&
      this.itemKeys.TITLE in value &&
      this.itemKeys.WEIGHT in value
    );
  }

  private isOptionId(value: unknown, lastId: number): boolean {
    if (!this.isString(value) || value[0] !== "#") {
      return false;
    }
    let id = Number(value.slice(1));
    return !(Number.isNaN(id) || id < 0 || id > lastId);
  }

  private isOptionWeight(value: unknown): boolean {
    const weight = value === "" ? value : Number(value);
    return !(this.isNumber(weight) && Number.isNaN(weight));
  }

  private isOptionTitle(value: unknown): boolean {
    return this.isString(value);
  }

  private isLastId(value: unknown): value is number {
    return this.isNumber(value) && value >= 0;
  }

  private isObject(value: unknown): value is object {
    return typeof value === "object" && value !== null;
  }

  private isString(value: unknown): value is string {
    return typeof value === "string";
  }

  private isNumber(value: unknown): value is number {
    return typeof value === "number";
  }
}
