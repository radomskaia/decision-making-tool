import type { ButtonSettings } from "@/components/buttons/settings/button-settings.ts";

export abstract class SettingsAction {
  protected abstract isOff: boolean;
  public abstract toggle(): void;

  protected constructor(protected button: ButtonSettings) {
    this.button = button;
  }
}
