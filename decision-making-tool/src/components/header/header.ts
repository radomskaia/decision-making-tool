import { createDOMElement } from "@/utils";
import utilitiesStyles from "@/styles/utilities.module.css";
import styles from "@/components/header/header.module.css";
import { BaseComponent } from "@/components/base-component.ts";
import type { HeaderSetting } from "@/type";
import { ButtonSettings } from "@/components/header/button-settings.ts";
import { ThemeToggle } from "@/components/theme-toggle.ts";

const APP_NAME = "Decision Making Tool";
export const ICONS_PATH = {
  soundOn: "sound-on",
  soundOff: "sound-off",
  themeLight: "theme-light",
  themeDark: "theme-dark",
};
const settings: Record<string, Required<HeaderSetting>> = {
  volume: {
    path: ICONS_PATH.soundOn,
    pathOff: ICONS_PATH.soundOff,
    title: "Volume",
  },
  changeTheme: {
    path: ICONS_PATH.themeLight,
    pathOff: ICONS_PATH.themeDark,
    title: "Change theme",
  },
};

export class Header extends BaseComponent<HTMLElement> {
  protected createView(): HTMLElement {
    const header = createDOMElement({
      tagName: "header",
      classList: [
        styles.header,
        utilitiesStyles.flex,
        utilitiesStyles.center,
        utilitiesStyles.justifyAround,
        utilitiesStyles.widthFull,
      ],
    });

    const headerPrimary = createDOMElement({
      tagName: "h1",
      textContent: APP_NAME,
      classList: [styles.headerPrimary],
    });

    const buttonWrapper = createDOMElement({
      tagName: "div",
      classList: [
        utilitiesStyles.flex,
        utilitiesStyles.center,
        utilitiesStyles.gap30,
      ],
    });

    for (const value of Object.values(settings)) {
      const button = this.createSettingsButton(value);
      buttonWrapper.append(button);
    }

    header.append(headerPrimary, buttonWrapper);
    return header;
  }

  private createSettingsButton(
    value: Required<HeaderSetting>,
  ): HTMLButtonElement {
    const { path, title, pathOff } = value;
    const button = new ButtonSettings(
      {
        path,
        title,
      },
      path,
      pathOff,
    );
    const theme = new ThemeToggle(button);
    button.getElement().addEventListener("click", () => {
      theme.toggle();
    });

    return button.getElement();
  }
}
