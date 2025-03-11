import type { CallbackRouter, OptionItemValue } from "src/types";
import { Home } from "@/pages/home.ts";
import { NotFound } from "@/pages/not-found.ts";
import {
  EMPTY_STRING,
  FIRST_ELEMENT_INDEX,
  HASH_SYMBOL,
  PAGE_PATH,
} from "@/constants/constants.ts";
export class Router {
  private static instance: Router | undefined;
  private routers = new Map<string, CallbackRouter>();
  private currentPath = EMPTY_STRING;
  private readonly baseUrl: string =
    globalThis.location.href.split(HASH_SYMBOL)[FIRST_ELEMENT_INDEX];
  private constructor() {
    globalThis.addEventListener("hashchange", () => this.routerChange());
  }

  public static getInstance(): Router {
    if (!Router.instance) {
      Router.instance = new Router();
    }
    return Router.instance;
  }

  public add(route: string, handler: CallbackRouter): void {
    this.routers.set(route, handler);
  }

  public init(): void {
    this.add(PAGE_PATH.HOME, (): void => {
      document.body.append(Home.getInstance().getElement());
    });
    const notFound = NotFound.getInstance();
    notFound.addHomeButtonListener(() => {
      this.navigateTo(PAGE_PATH.HOME);
      notFound.getElement().remove();
    });
    this.routerChange();
  }

  public navigateTo(path: string, data?: OptionItemValue[]): void {
    this.currentPath = path;
    globalThis.history.pushState(null, EMPTY_STRING, `${HASH_SYMBOL}${path}`);
    globalThis.history.replaceState(
      null,
      EMPTY_STRING,
      `${this.baseUrl}${HASH_SYMBOL}${path}`,
    );
    Home.getInstance().getElement().remove();

    if (this.routers.has(path)) {
      NotFound.getInstance().getElement().remove();
      const handler = this.routers.get(path);

      if (handler) {
        handler(data);
      }
    } else {
      document.body.append(NotFound.getInstance().getElement());
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
