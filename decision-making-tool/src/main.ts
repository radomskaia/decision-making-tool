import { Header } from "@/components/header/header.ts";
import { SoundButton } from "@/components/button/sound-button.ts";
import { ThemeButton } from "@/components/button/theme-button.ts";
import { ThemeToggle } from "@/components/theme-toggle.ts";
import { AudioElement } from "@/components/audio.ts";

const soundButton = new SoundButton();
const soundAction = new AudioElement(soundButton);
const themeButton = new ThemeButton();
const themeAction = new ThemeToggle(themeButton);

const settingsButton = [
  {
    button: soundButton,
    action: soundAction,
  },
  {
    button: themeButton,
    action: themeAction,
  },
];

document.body.append(new Header(settingsButton).getElement());
