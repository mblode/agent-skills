import { defineConfig } from "tsdown";

export default defineConfig([
  {
    entry: { cli: "src/cli.ts" },
    format: ["esm"],
    platform: "node",
    clean: true,
    dts: false,
    target: "node24",
    banner: { js: "#!/usr/bin/env node" },
  },
  {
    entry: { index: "src/index.ts" },
    format: ["esm"],
    platform: "node",
    dts: true,
    target: "node24",
  },
]);
