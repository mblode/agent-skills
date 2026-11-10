import { defineConfig } from "tsdown";

export default defineConfig([
  {
    entry: { cli: "src/cli.ts" },
    format: ["esm"],
    platform: "node",
    fixedExtension: false,
    clean: true,
    dts: true,
    sourcemap: true,
    target: "node24",
  },
  {
    entry: { index: "src/index.ts" },
    format: ["esm"],
    platform: "node",
    fixedExtension: false,
    dts: true,
    sourcemap: true,
    target: "node24",
  },
]);
