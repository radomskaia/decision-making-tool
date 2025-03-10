import { createDOMElement } from "@/utils";
import utilitiesStyles from "@/styles/utilities.module.css";
import styles from "@/components/header/header.module.css";
import { BaseComponent } from "@/components/base-component.ts";
import { SoundButton } from "@/components/buttons/settings/sound-button.ts";
import { AudioElement } from "@/components/settings/audio.ts";
import { ThemeButton } from "@/components/buttons/settings/theme-button.ts";
import { ThemeToggle } from "@/components/settings/theme-toggle.ts";
import { APP_NAME } from "@/constants/constants.ts";

export class Header extends BaseComponent<"header"> {
  private readonly settingsButton = {
    sound: {
      button: SoundButton,
      action: AudioElement,
    },
    theme: {
      button: ThemeButton,
      action: ThemeToggle,
    },
  };
  private readonly buttonWrapper: HTMLDivElement;
  constructor() {
    super();
    this.buttonWrapper = this.createButtonWrapper();
    this.appendElement(this.buttonWrapper);
  }

  protected createView(): HTMLElement {
    const header = createDOMElement({
      tagName: "header",
      classList: [
        styles.header,
        utilitiesStyles.container,
        utilitiesStyles.flex,
        utilitiesStyles.alignCenter,
        utilitiesStyles.justifyBetween,
        utilitiesStyles.widthFull,
      ],
    });

    const headerPrimary = createDOMElement({
      tagName: "h1",
      textContent: APP_NAME,
      classList: [styles.headerPrimary],
    });

    header.append(headerPrimary);
    return header;
  }

  private createButtonWrapper(): HTMLDivElement {
    return createDOMElement({
      tagName: "div",
      classList: [
        utilitiesStyles.flex,
        utilitiesStyles.center,
        utilitiesStyles.gap30,
      ],
    });
  }

  public addSoundButton(buttonName: keyof typeof this.settingsButton): this {
    const button = new this.settingsButton[buttonName].button();
    const action = new this.settingsButton[buttonName].action(button);
    button.addToggleListener(action);
    this.buttonWrapper.append(button.getElement());
    return this;
  }
}
