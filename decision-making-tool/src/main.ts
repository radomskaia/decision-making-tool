import { Header } from "@/components/header/header.ts";
import { Main } from "@/components/main/main.ts";

const body = document.body;
const header = new Header()
  .addSoundButton("theme")
  .addSoundButton("sound")
  .getElement();
const main = new Main().getElement();
body.append(header, main);
