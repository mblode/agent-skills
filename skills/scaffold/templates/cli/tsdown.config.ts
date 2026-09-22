import { defineConfig } from "tsdown";

// Two entries on purpose: the CLI gets the shebang and no types, the library
// gets types and no shebang. Merging them puts a shebang in the library.
//
// fixedExtension: false keeps .js and .d.ts. tsdown's node-platform default
// emits .mjs and .d.mts, and then bin and exports in package.json point at
// files that do not exist. The build check compares them after every change.
export default defineConfig([
  {
    entry: { cli: "src/cli.ts" },
    format: ["esm"],
    platform: "node",
    fixedExtension: false,
    clean: true,
    dts: false,
    sourcemap: true,
    banner: { js: "#!/usr/bin/env node" },
  },
  {
    entry: { index: "src/index.ts" },
    format: ["esm"],
    platform: "node",
    fixedExtension: false,
    dts: true,
    sourcemap: true,
  },
]);
