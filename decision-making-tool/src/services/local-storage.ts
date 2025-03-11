import { ERROR_MESSAGES, LS_PREFIX } from "@/constants/constants.ts";
import type { OptionListValue, StorageKeys, TypeGuard } from "@/types";

export class LocalStorage {
  private static instance = new LocalStorage();
  public static getInstance(): LocalStorage {
    return LocalStorage.instance;
  }

  public saveToStorage(
    key: StorageKeys,
    value: OptionListValue | boolean,
  ): void {
    const storageKey = LS_PREFIX + key;
    globalThis.localStorage.setItem(storageKey, JSON.stringify(value));
  }

  public loadFromStorage<T>(
    key: StorageKeys,
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
      throw new Error(ERROR_MESSAGES.INVALID_VALUE);
    }
  }
}
