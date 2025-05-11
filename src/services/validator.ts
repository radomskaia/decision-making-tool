import type { OptionItemValue, OptionListValue } from "@/types";
import { EMPTY_STRING, FIRST_INDEX, ZERO } from "@/constants/constants.ts";
import {
  ID_PREFIX,
  OptionsConstants,
  OPTION_KEYS,
  OPTION_LIST_KEYS,
} from "@/constants/options-constants.ts";

export class Validator {
  private static instance: Validator | undefined;
  private constructor(
    private itemKeys = OPTION_KEYS,
    private listKeys = OPTION_LIST_KEYS,
    private idPrefix = ID_PREFIX,
  ) {}
  public static getInstance(): Validator {
    if (!Validator.instance) {
      Validator.instance = new Validator();
    }
    return Validator.instance;
  }
  public static isBoolean(value: unknown): value is boolean {
    return typeof value === "boolean";
  }

  public static isPositiveNumber(value: unknown): value is number {
    return Validator.isNumber(value) && value >= ZERO;
  }

  public static isValidWeight(value: string | number): boolean {
    const numberValue = typeof value === "string" ? Number(value) : value;
    return !Number.isNaN(numberValue) && this.isPositiveNumber(numberValue);
  }

  public static isValidOption(item: OptionItemValue): boolean {
    return item.title.trim().length > ZERO && Number(item.weight) > ZERO;
  }

  public static hasMinimumOptions(data: OptionItemValue[]): boolean {
    return data.length >= OptionsConstants;
  }

  public static isOptionsCountValid(value: OptionListValue): boolean {
    const data = value.list.filter((element) =>
      Validator.isValidOption(element),
    );

    return Validator.hasMinimumOptions(data);
  }

  private static isObject(value: unknown): value is object {
    return typeof value === "object" && value !== null;
  }

  private static isString(value: unknown): value is string {
    return typeof value === "string";
  }

  private static isNumber(value: unknown): value is number {
    return typeof value === "number";
  }

  private static isEmptyOrStringifiedNumber(value: unknown): boolean {
    value = value === EMPTY_STRING ? value : Number(value);
    return !(Validator.isNumber(value) && Number.isNaN(value));
  }

  public isOptionListValue(value: unknown): value is OptionListValue {
    if (
      !(
        this.isList(value) &&
        Validator.isPositiveNumber(value.lastId) &&
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

  private isList(value: unknown): value is OptionListValue {
    if (!Validator.isObject(value)) {
      return false;
    }
    return this.listKeys.LAST_ID in value && this.listKeys.LIST in value;
  }

  private isOption(value: unknown): value is OptionItemValue {
    if (!Validator.isObject(value)) {
      return false;
    }
    return (
      this.itemKeys.ID in value &&
      this.itemKeys.TITLE in value &&
      this.itemKeys.WEIGHT in value
    );
  }

  private isOptionId(value: unknown, lastId: number): boolean {
    if (
      !Validator.isString(value) ||
      value.slice(FIRST_INDEX, this.idPrefix.length) !== ID_PREFIX
    ) {
      return false;
    }
    let id = Number(value.slice(this.idPrefix.length));
    return !(Number.isNaN(id) || id < ZERO || id > lastId);
  }

  private isOptionItemValue(
    value: unknown,
    lastId: number,
  ): value is OptionItemValue {
    return (
      this.isOption(value) &&
      this.isOptionId(value.id, lastId) &&
      Validator.isEmptyOrStringifiedNumber(value.weight) &&
      Validator.isString(value.title)
    );
  }
}
