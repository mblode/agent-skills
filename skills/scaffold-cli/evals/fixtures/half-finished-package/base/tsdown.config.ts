import { defineConfig } from "tsdown";

export default defineConfig([
  {
    entry: { cli: "src/cli.ts" },
    format: ["esm"],
    platform: "node",
    fixedExtension: false,
    clean: true,
    dts: false,
    sourcemap: true,
    target: "node24",
    banner: { js: "#!/usr/bin/env node" },
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
