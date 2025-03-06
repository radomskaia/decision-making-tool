import type { ButtonSettings } from "@/components/button/button-settings.ts";
import { SettingsAction } from "@/components/settings-action.ts";

export class AudioElement extends SettingsAction {
  private audio: HTMLAudioElement;
  protected isOff = false;
  constructor(audioButton: ButtonSettings) {
    super(audioButton);
    this.audio = this.creatAudio();
  }

  private creatAudio(): HTMLAudioElement {
    const audio = new Audio("");
    audio.load();
    return audio;
  }

  public playAudio(): void {
    this.audio
      .play()
      .catch((error: Error) =>
        console.error("Ошибка воспроизведения аудио:", error),
      );
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
