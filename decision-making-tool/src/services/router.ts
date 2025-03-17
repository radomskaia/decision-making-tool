import type { Route } from "src/types";
import {
  EMPTY_STRING,
  MESSAGES,
  PAGE_PATH,
  SYMBOLS,
} from "@/constants/constants.ts";
import { DecisionPicker } from "@/pages/decision-picker/decision-picker.ts";
export class Router {
  private static instance: Router | undefined;
  private routes: Route[] = [];
  private currentPath = EMPTY_STRING;
  private isPopState = false;
  private constructor() {
    globalThis.addEventListener("hashchange", () => this.routerChange());
    globalThis.addEventListener("popstate", () => {
      this.isPopState = true;
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
    this.updateHistory(path);
    this.clearPage();

    let route = this.findValidRoute(path);

    if (!route) {
      throw new Error(MESSAGES.ROUTE_NOT_FOUND);
    }
    document.body.append(route.component.getInstance().getElement());
    const decision = route.component.getInstance();
    if (decision instanceof DecisionPicker) {
      decision.focusInput();
    }
  }

  public getCurrentRoute(): string {
    return this.currentPath;
  }

  private findValidRoute(path: string): Route | undefined {
    let route =
      this.routes.find((route) => route.path === path) ||
      this.routes.find((route) => route.path === PAGE_PATH.NOT_FOUND);

    if (route && !Router.canNavigateToDecision(route)) {
      route = this.routes?.find((route) => route.path === PAGE_PATH.HOME);
    }

    return route;
  }

  private updateHistory(path: string): void {
    if (this.isPopState) {
      this.isPopState = false;
      return;
    }
    const history = globalThis.history;
    history.pushState(null, EMPTY_STRING, `${SYMBOLS.hash}${path}`);
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
