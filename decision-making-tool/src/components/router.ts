import type { Callback } from "@/type";

export class Router {
  private routers = new Map<string, Callback>();
  private currentPath = "";
  private readonly baseUrl: string = globalThis.location.href.split("#")[0];
  constructor() {
    globalThis.addEventListener("hashchange", () => this.routerChange());
    this.routerChange();
  }
  public add(route: string, handler: Callback): void {
    this.routers.set(route, handler);
  }
  public navigateTo(path: string): void {
    if (path === this.currentPath) {
      return;
    }
    if (this.routers.has(path)) {
      const handler = this.routers.get(path);
      this.currentPath = path;
      globalThis.history.pushState(null, "", `#${path}`);
      globalThis.history.replaceState(null, "", `${this.baseUrl}#${path}`);

      if (handler) {
        handler();
      }
    } else {
      console.error("Not Found", path);
    }
  }

  private routerChange(): void {
    const hash: string = globalThis.location.hash.slice(1) || "/";
    this.navigateTo(hash);
  }
}
