import { Header } from "@/components/header/header.ts";

document.body.append(
  new Header().addSoundButton("theme").addSoundButton("sound").getElement(),
);
