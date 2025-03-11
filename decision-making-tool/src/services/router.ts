import type { Route } from "src/types";
import {
  EMPTY_STRING,
  MESSAGES,
  HASH_SYMBOL,
  PAGE_PATH,
} from "@/constants/constants.ts";
export class Router {
  private static instance: Router | undefined;
  private routes: Route[] | undefined;
  private currentPath = EMPTY_STRING;
  private isPopState = false;
  private constructor() {
    globalThis.addEventListener("hashchange", () => this.routerChange());
    globalThis.addEventListener("popstate", () => {
      console.log("popstate");
      this.isPopState = true;
    });
  }

  public static getInstance(): Router {
    if (!Router.instance) {
      Router.instance = new Router();
    }
    return Router.instance;
  }

  public addRoutes(routes: Route[]): void {
    this.routes = routes;
    this.routerChange();
  }

  public navigateTo(path: string): void {
    this.currentPath = path;
    this.updateHistory(path);
    this.clearPage();

    if (!this.routes) {
      throw new Error(MESSAGES.ROUTE_NOT_FOUND);
    }
    const route =
      this.routes.find((route) => route.path === path) ||
      this.routes.find((route) => route.path === PAGE_PATH.NOT_FOUND);
    if (!route) {
      throw new Error(MESSAGES.ROUTE_NOT_FOUND);
    }
    document.body.append(route.component.getInstance().getElement());
  }

  private updateHistory(path: string): void {
    if (this.isPopState) {
      this.isPopState = false;
      return;
    }
    const history = globalThis.history;
    history.pushState(null, EMPTY_STRING, `${HASH_SYMBOL}${path}`);
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
      globalThis.location.hash.slice(HASH_SYMBOL.length) || PAGE_PATH.HOME;
    if (hash === this.currentPath) {
      return;
    }
    this.navigateTo(hash);
  }
}
