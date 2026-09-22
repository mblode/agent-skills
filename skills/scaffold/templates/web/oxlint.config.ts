import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import next from "ultracite/oxlint/next";
import react from "ultracite/oxlint/react";
import shadcn from "ultracite/oxlint/shadcn";

export default defineConfig({
  extends: [core, next, react, shadcn],
  ignorePatterns: core.ignorePatterns,
  // Oxlint already loads the plugin from the preset; Knip reads jsPlugins only
  // off the root config and otherwise flags @shadcn/lint as unused.
  jsPlugins: shadcn.jsPlugins,
});
