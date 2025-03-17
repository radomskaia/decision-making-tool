import type { Route } from "src/types";
import {
  EMPTY_STRING,
  MESSAGES,
  ONE,
  PAGE_PATH,
  SYMBOLS,
} from "@/constants/constants.ts";
import { DecisionPicker } from "@/pages/decision-picker/decision-picker.ts";
import { Home } from "@/pages/home/home.ts";
export class Router {
  private static instance: Router | undefined;
  private routes: Route[] = [];
  private currentPath = EMPTY_STRING;
  private constructor() {
    globalThis.addEventListener("hashchange", () => {
      console.log("hashchange");
      this.routerChange();
    });
  }

  public static getInstance(): Router {
    if (!Router.instance) {
      Router.instance = new Router();
    }
    return Router.instance;
  }

  private static canNavigateToDecision(route: Route): boolean {
    if (route.path !== PAGE_PATH.DECISION_PICKER) {
      return true;
    }
    const decision = route.component.getInstance();
    return decision instanceof DecisionPicker && decision.isRenderWheel();
  }

  public addRoutes(routes: Route[]): void {
    this.routes = routes;
    this.routerChange();
  }

  public navigateTo(path: string): void {
    this.currentPath = path;
    this.clearPage();
    let route = this.findValidRoute(path);
    if (!route) {
      throw new Error(MESSAGES.ROUTE_NOT_FOUND);
    }
    globalThis.location.hash = route.path;
    document.body.append(route.component.getInstance().getElement());
    const instance = route.component.getInstance();
    if (instance instanceof DecisionPicker) {
      instance.focusInput();
    } else if (instance instanceof Home) {
      window.scrollTo(ONE, ONE);
    }
  }

  public getCurrentRoute(): string {
    return this.currentPath;
  }

  private findValidRoute(path: string): Route | undefined {
    let route =
      this.routes.find((route) => route.path === path) ||
      this.routes.find((route) => route.path === PAGE_PATH.NOT_FOUND);
    if (path === PAGE_PATH.DECISION_PICKER) {
      const homeComponent = this.routes
        .find((route) => route.path === PAGE_PATH.HOME)
        ?.component.getInstance();
      if (homeComponent instanceof Home) {
        homeComponent.saveToLocalStorage();
      }
    }
    if (route && !Router.canNavigateToDecision(route)) {
      route = this.routes?.find((route) => route.path === PAGE_PATH.HOME);
    }

    return route;
  }

  private clearPage(): void {
    if (!this.routes) {
      throw new Error(MESSAGES.ROUTE_NOT_FOUND);
    }
    for (const route of this.routes) {
      const element = route.component.getInstance().getElement();
      if (element.parentNode) {
        element.remove();
      }
    }
  }

  private routerChange(): void {
    const hash: string =
      globalThis.location.hash.slice(SYMBOLS.hash.length) || PAGE_PATH.HOME;
    if (hash === this.currentPath) {
      return;
    }
    this.navigateTo(hash);
  }
}
