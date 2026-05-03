import { defineConfig } from "tsup"

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    noExternal: ["@tailwindest/core"],
    dts: true,
    clean: true,
    target: "esnext",
    tsconfig: "tsconfig.build.json",
})
