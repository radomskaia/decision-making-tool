import type { ButtonSettings } from "@/components/buttons/settings/button-settings.ts";
import { SettingsAction } from "@/components/settings/settings-action.ts";
import { MESSAGES } from "@/constants/constants.ts";
import { LocalStorage } from "@/services/local-storage.ts";
import { StorageKeys } from "@/types";
import { Validator } from "@/services/validator.ts";

export class AudioElement extends SettingsAction {
  private static instance: AudioElement | undefined;
  protected isOff = false;
  private audio: HTMLAudioElement;
  constructor(audioButton: ButtonSettings) {
    super(audioButton);
    this.audio = new Audio("./src/shared/end-sound.mp3");
    this.init();
    window.addEventListener("beforeunload", () => {
      LocalStorage.getInstance().save(StorageKeys.soundSettings, this.isOff);
    });
  }

  public static getInstance(audioButton?: ButtonSettings): AudioElement {
    if (!AudioElement.instance) {
      if (!audioButton) {
        throw new Error(MESSAGES.NOT_INITIALIZED);
      }
      AudioElement.instance = new AudioElement(audioButton);
    }
    return AudioElement.instance;
  }

  public changeSettings(): void {
    this.audio.muted = this.isOff;
    this.button.togglePath(this.isOff);
  }

  public playAudio(): void {
    this.audio
      .play()
      .catch((error: Error) => console.error(MESSAGES.PLAYBACK, error));
    this.audio.addEventListener("ended", () => {
      this.button.buttonDisabled(false);
    });
  }

  public getButton(): ButtonSettings {
    return this.button;
  }

  public toggle(): void {
    this.isOff = !this.isOff;
    this.audio.muted = this.isOff;
    this.button.togglePath(this.isOff);
  }

  private init(): void {
    const lsData = LocalStorage.getInstance().load(
      StorageKeys.soundSettings,
      Validator.isBoolean,
    );
    if (lsData !== null) {
      this.isOff = lsData;
      this.changeSettings();
    }
    this.audio.load();
  }
}
