import { PAGE_PATH } from "@/constants/constants.ts";
import { Home } from "@/pages/home.ts";
import { DecisionPicker } from "@/pages/decision-picker.ts";
import { NotFound } from "@/pages/not-found.ts";
import type { Route } from "@/types";

export const appRoutes: Route[] = [
  {
    path: PAGE_PATH.HOME,
    component: Home,
  },
  {
    path: PAGE_PATH.DECISION_PICKER,
    component: DecisionPicker,
  },
  {
    path: PAGE_PATH.NOT_FOUND,
    component: NotFound,
  },
];
