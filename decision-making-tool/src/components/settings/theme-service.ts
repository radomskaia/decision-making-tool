import type { ButtonSettings } from "@/components/buttons/settings/button-settings.ts";
import { SettingsAction } from "@/components/settings/settings-action.ts";
import {
  WHEEL_COLORS,
  DARK_THEME_ATTRIBUTE,
  DARK_THEME_MEDIA_QUERY,
  MESSAGES,
  PAGE_PATH,
} from "@/constants/constants.ts";
import type { WheelColors } from "@/types";
import { Router } from "@/services/router.ts";

export class ThemeService extends SettingsAction {
  private static instance: ThemeService | undefined;
  protected isOff: boolean;
  private colors: WheelColors | null = null;
  private mediaQueryList: MediaQueryList;
  private toggleListener: ((colors: WheelColors) => void) | null = null;
  constructor(themeButton: ButtonSettings) {
    super(themeButton);
    this.mediaQueryList = globalThis.matchMedia(DARK_THEME_MEDIA_QUERY);
    this.isOff = this.mediaQueryList.matches;
    this.setColors(this.isOff);
    this.changeTheme(this.isOff);
    this.mediaQueryList.addEventListener("change", (event) => {
      this.changeTheme(event.matches);
    });
  }

  public static getInstance(audioButton?: ButtonSettings): ThemeService {
    if (!ThemeService.instance) {
      if (!audioButton) {
        throw new Error(MESSAGES.NOT_INITIALIZED);
      }
      ThemeService.instance = new ThemeService(audioButton);
    }
    return ThemeService.instance;
  }

  public getColors(): WheelColors {
    if (this.colors) {
      return this.colors;
    } else {
      throw new Error(MESSAGES.NOT_INITIALIZED);
    }
  }

  public toggle(): void {
    this.isOff = !this.isOff;
    this.changeTheme(this.isOff);
  }

  public addListener(callback: (colors: WheelColors) => void): void {
    this.toggleListener = callback;
  }

  private setColors(isDark: boolean): void {
    this.colors = isDark ? WHEEL_COLORS.DARK_THEME : WHEEL_COLORS.LIGHT_THEME;
  }

  private changeTheme(isDark: boolean): void {
    this.button.togglePath(isDark);
    this.setColors(isDark);
    document.body.toggleAttribute(DARK_THEME_ATTRIBUTE, isDark);
    if (
      Router.getInstance().getCurrentRoute() === PAGE_PATH.DECISION_PICKER &&
      this.toggleListener &&
      this.colors
    ) {
      this.toggleListener(this.colors);
    }
  }
}
