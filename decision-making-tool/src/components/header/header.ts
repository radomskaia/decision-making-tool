import utilitiesStyles from "@/styles/utilities.module.css";
import styles from "@/components/header/header.module.css";
import { BaseComponent } from "@/components/base-component.ts";
import { SoundButton } from "@/components/buttons/settings/sound-button.ts";
import { AudioService } from "@/services/settings/audio-service.ts";
import { ThemeButton } from "@/components/buttons/settings/theme-button.ts";
import { ThemeService } from "@/services/settings/theme-service.ts";
import { APP_NAME } from "@/constants/constants.ts";

export class Header extends BaseComponent<"header"> {
  private readonly settingsButton = {
    sound: {
      button: SoundButton,
      action: AudioService,
    },
    theme: {
      button: ThemeButton,
      action: ThemeService,
    },
  };
  private readonly buttonWrapper: HTMLDivElement;
  constructor() {
    super();
    this.buttonWrapper = this.createButtonWrapper();
    this.appendElement(this.buttonWrapper);
  }

  public addSoundButton(buttonName: keyof typeof this.settingsButton): this {
    const button = new this.settingsButton[buttonName].button();
    const action = this.settingsButton[buttonName].action.getInstance(button);
    button.addToggleListener(action);
    this.buttonWrapper.append(button.getElement());
    return this;
  }

  protected createView(): HTMLElement {
    const header = this.createDOMElement({
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

    const headerPrimary = this.createDOMElement({
      tagName: "h1",
      textContent: APP_NAME,
      classList: [styles.headerPrimary],
    });

    header.append(headerPrimary);
    return header;
  }

  private createButtonWrapper(): HTMLDivElement {
    return this.createDOMElement({
      tagName: "div",
      classList: [
        utilitiesStyles.flex,
        utilitiesStyles.center,
        utilitiesStyles.gap30,
      ],
    });
  }
}
