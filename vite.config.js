import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import htmlMinifier from "vite-plugin-html-minifier-terser";

const src = (folder) => fileURLToPath(new URL(`./src/${folder}`, import.meta.url));
const html = (name) => fileURLToPath(new URL(`./src/${name}.html`, import.meta.url));

export default defineConfig({
  root: "src/",
  publicDir: "../static/",
  base: "./",

  resolve: {
    alias: {
      pages: src("pages"),
      entities: src("entities"),
      features: src("features"),
      shared: src("shared"),
      style: src("style"),
    },
  },

  server: {
    host: true,
    open: !(
      "SANDBOX_URL" in process.env ||
      "CODESANDBOX_HOST" in process.env
    ),
  },

  build: {
    outDir: "../dist",
    emptyOutDir: true,
    sourcemap: true,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      input: {
        main: html("index"),
        moto: html("moto"),
        pickup: html("pickup"),
        bus: html("bus"),
        kamaz: html("kamaz"),
        kater: html("kater"),
        moskvich: html("moskvich"),
        velo: html("velo"),
        pageAR: html("pageAR"),
        pageARLarge: html("pageARLarge"),
      },
      output: {
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name ?? "";
          const extType = name.split(".").pop()?.toLowerCase() ?? "";

          if (/^(css|scss)$/.test(extType)) {
            return "assets/style/[name][extname]";
          }

          if (/^(js)$/.test(extType)) {
            return "assets/js/[name][extname]";
          }

          if (/^(ttf|otf|woff|woff2)$/.test(extType)) {
            return "assets/fonts/[name][extname]";
          }

          return "assets/images/[name][extname]";
        },
        chunkFileNames: "assets/js/[name].js",
        entryFileNames: "assets/js/[name].js",
      },
    },
    cssMinify: true,
  },

  plugins: [
    react(),
    htmlMinifier({
      minify: true,
      removeComments: true,
    }),
  ],
});
