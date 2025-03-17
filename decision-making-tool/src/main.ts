import { Header } from "@/components/header/header.ts";
import { Router } from "@/services/router.ts";
import { appRoutes } from "@/pages/routes.ts";
import { ONE } from "@/constants/constants.ts";

const body = document.body;
const header = new Header()
  .addSoundButton("theme")
  .addSoundButton("sound")
  .getElement();

body.append(header);

Router.getInstance().addRoutes(appRoutes);

window.scrollTo(ONE, ONE);
