import type { ButtonSettings } from "@/components/buttons/settings/button-settings.ts";
import { SettingsAction } from "@/components/settings/settings-action.ts";
import { ERROR_MESSAGES } from "@/constants/constants.ts";
import { LocalStorage } from "@/services/local-storage.ts";

export class AudioElement extends SettingsAction {
  private audio: HTMLAudioElement;
  protected isOff = false;
  constructor(audioButton: ButtonSettings) {
    super(audioButton);
    this.audio = this.creatAudio();
    this.init();
    window.addEventListener("beforeunload", () => {
      LocalStorage.getInstance().saveToStorage("soundSettings", this.isOff);
    });
  }

  private creatAudio(): HTMLAudioElement {
    const audio = new Audio("");
    audio.load();
    return audio;
  }

  private init(): void {
    const lsData = LocalStorage.getInstance().loadFromStorage(
      "soundSettings",
      (value) => typeof value === "boolean",
    );
    if (lsData !== null) {
      this.isOff = lsData;
      this.changeSettings();
    }
  }

  public changeSettings(): void {
    this.audio.muted = this.isOff;
    this.button.togglePath(this.isOff);
  }

  public playAudio(): void {
    this.audio
      .play()
      .catch((error: Error) => console.error(ERROR_MESSAGES.PLAYBACK, error));
    this.audio.addEventListener("ended", () => {
      console.log("End");
    });
  }

  public toggle(): void {
    this.isOff = !this.isOff;
    this.audio.muted = this.isOff;
    this.button.togglePath(this.isOff);
  }
}
