import type { ButtonSettings } from "@/components/header/button-settings.ts";

export class ThemeToggle {
  private mediaQueryList: MediaQueryList;
  private isDark: boolean;
  private themeButton: ButtonSettings;
  constructor(themeButton: ButtonSettings) {
    this.themeButton = themeButton;
    this.mediaQueryList = globalThis.matchMedia("(prefers-color-scheme: dark)");
    this.isDark = this.mediaQueryList.matches;
    this.mediaQueryList.addEventListener("change", (event) => {
      this.changeTheme(event.matches);
    });
  }

  public changeTheme(isDark: boolean): void {
    this.themeButton.togglePath(isDark);
    document.body.toggleAttribute("data-theme", isDark);
  }

  public toggle(): void {
    this.isDark = !this.isDark;
    this.changeTheme(this.isDark);
  }
}
