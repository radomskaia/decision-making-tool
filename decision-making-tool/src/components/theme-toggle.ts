import type { ButtonSettings } from "@/components/button/button-settings.ts";
import { SettingsAction } from "@/components/settings-action.ts";
import { DARK_THEME_ATTRIBUTE, DARK_THEME_MEDIA_QUERY } from "@/constants.ts";

export class ThemeToggle extends SettingsAction {
  private mediaQueryList: MediaQueryList;
  protected isOff: boolean;
  constructor(themeButton: ButtonSettings) {
    super(themeButton);
    this.mediaQueryList = globalThis.matchMedia(DARK_THEME_MEDIA_QUERY);
    this.isOff = this.mediaQueryList.matches;
    this.changeTheme(this.isOff);
    this.mediaQueryList.addEventListener("change", (event) => {
      this.changeTheme(event.matches);
    });
  }

  public changeTheme(isDark: boolean): void {
    this.button.togglePath(isDark);
    document.body.toggleAttribute(DARK_THEME_ATTRIBUTE, isDark);
  }

  public toggle(): void {
    this.isOff = !this.isOff;
    this.changeTheme(this.isOff);
  }
}
