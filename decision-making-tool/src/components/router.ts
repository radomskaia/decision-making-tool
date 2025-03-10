import type { Callback } from "@/type";
import { Main } from "@/components/main/main.ts";
import { NotFound } from "@/components/not-found.ts";
import { PAGE_PATH } from "@/constants.ts";
export class Router {
  private static instance: Router | undefined;
  private routers = new Map<string, Callback>();
  private currentPath = "";
  private readonly hashSymbol = "#";
  private readonly baseUrl: string = globalThis.location.href.split(
    this.hashSymbol,
  )[0];
  private constructor() {
    globalThis.addEventListener("hashchange", () => this.routerChange());
    this.init();
    this.routerChange();
  }

  public static getInstance(): Router {
    if (!Router.instance) {
      Router.instance = new Router();
    }
    return Router.instance;
  }

  public add(route: string, handler: Callback): void {
    this.routers.set(route, handler);
  }

  public init(): void {
    this.add(PAGE_PATH.HOME, (): void => {
      document.body.append(Main.getInstance().getElement());
    });
    const notFound = NotFound.getInstance();
    notFound.addHomeButtonListener(() => {
      this.navigateTo(PAGE_PATH.HOME);
      notFound.getElement().remove();
    });
  }

  public navigateTo(path: string): void {
    this.currentPath = path;
    globalThis.history.pushState(null, "", `${this.hashSymbol}${path}`);
    globalThis.history.replaceState(
      null,
      "",
      `${this.baseUrl}${this.hashSymbol}${path}`,
    );
    Main.getInstance().getElement().remove();

    if (this.routers.has(path)) {
      NotFound.getInstance().getElement().remove();
      const handler = this.routers.get(path);

      if (handler) {
        handler();
      }
    } else {
      document.body.append(NotFound.getInstance().getElement());
    }
  }

  private routerChange(): void {
    const hash: string = globalThis.location.hash.slice(1) || PAGE_PATH.HOME;
    if (hash === this.currentPath) {
      return;
    }
    this.navigateTo(hash);
  }
}
