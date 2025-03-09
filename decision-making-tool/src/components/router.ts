import type { Callback } from "@/type";
import { Main } from "@/components/main/main.ts";
import { NotFound } from "@/components/not-found.ts";

export class Router {
  private static instance: Router | undefined;
  public static getInstance(): Router {
    if (!Router.instance) {
      Router.instance = new Router();
    }
    return Router.instance;
  }
  private routers = new Map<string, Callback>();
  private currentPath = "";
  private readonly baseUrl: string = globalThis.location.href.split("#")[0];

  private constructor() {
    globalThis.addEventListener("hashchange", () => this.routerChange());
    this.init();
    this.routerChange();
  }

  public add(route: string, handler: Callback): void {
    this.routers.set(route, handler);
  }

  public init(): void {
    this.add("/", (): void => {
      document.body.append(Main.getInstance().getElement());
    });
    const notFound = NotFound.getInstance();
    notFound.addHomeButtonListener(() => {
      this.navigateTo("/");
      notFound.getElement().remove();
    });
  }

  public navigateTo(path: string): void {
    this.currentPath = path;
    globalThis.history.pushState(null, "", `#${path}`);
    globalThis.history.replaceState(null, "", `${this.baseUrl}#${path}`);
    Main.getInstance().getElement().remove();

    if (this.routers.has(path)) {
      NotFound.getInstance().getElement().remove();
      const handler = this.routers.get(path);

      if (handler) {
        handler();
      }
    } else {
      document.body.append(NotFound.getInstance().getElement());
      console.error("Not Found", path);
    }
  }

  private routerChange(): void {
    const hash: string = globalThis.location.hash.slice(1) || "/";
    if (hash === this.currentPath) {
      return;
    }
    this.navigateTo(hash);
  }
}
