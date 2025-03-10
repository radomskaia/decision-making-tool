import { Header } from "@/components/header/header.ts";
import { Router } from "@/services/router.ts";

const body = document.body;
const header = new Header()
  .addSoundButton("theme")
  .addSoundButton("sound")
  .getElement();

body.append(header);

Router.getInstance();
