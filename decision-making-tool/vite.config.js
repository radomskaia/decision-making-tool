import path, { resolve } from "path";
import { defineConfig } from "vite";
import autoprefixer from "autoprefixer";
import checker from "vite-plugin-checker";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import createSvgSpritePlugin from "vite-plugin-svg-spriter";
import tsconfigPaths from "vite-tsconfig-paths";

const SRC_PATH = path.resolve(__dirname, "src");
const SVG_FOLDER_PATH = path.resolve(SRC_PATH, "shared/svg");

export default defineConfig({
  base: "./",
  build: {
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
    cssCodeSplit: false,
  },
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
  plugins: [
    createSvgSpritePlugin({
      svgFolder: SVG_FOLDER_PATH,
      outputDir: "public/icons",
      spriteFilename: "sprite.svg",
      symbolId: "[name]",
    }),
    ViteImageOptimizer({
      jpg: {
        quality: 85,
      },
      png: {
        quality: 85,
      },
      webp: {
        quality: 70,
      },
    }),
    tsconfigPaths(),
    checker({
      typescript: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
