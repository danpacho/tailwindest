import path from "path"
import typescript from "@rollup/plugin-typescript"
import esbuild from "rollup-plugin-esbuild"
import { terser } from "rollup-plugin-terser"
import { bundleSizePlugin } from "./js/plugin/bundleSizePlugin.js"

/**@typedef {import('rollup').RollupOptions} RollupOptions */
/**@typedef {"production" | "development"} ENV */
/**@typedef {{input: string; output: string, env?: ENV}} Config */

/**
 * @param {string} target [target options documentation](https://esbuild.github.io/api/#target)
 * @param {ENV} env
 * @returns esbuild
 */
function getEsbuildPlugin(target, env = "development") {
    return esbuild({
        minify: env === "production",
        target,
        tsconfig: path.resolve("./tsconfig.json"),
        color: true,
    })
}

/**
 * @param {Config} config
 * @returns {RollupOptions} ESM config
 */
function getESMConfig({ input, output, env }) {
    return {
        input,
        output: [{ file: `${output}.js`, format: "esm" }],
        plugins:
            env === "production"
                ? [getEsbuildPlugin("node14", env), terser()]
                : [getEsbuildPlugin("node14", env)],
    }
}

/**
 * @param {Config} config
 * @returns {RollupOptions} `.d.ts` config
 */
function getTypeDefConfig({ input, output }) {
    return {
        input,
        output: {
            dir: output,
        },
        plugins: [
            typescript({
                declaration: true,
                emitDeclarationOnly: true,
                outDir: output,
            }),
        ],
    }
}

/**
 * @param {{devBuildPath: string, productionBuildPath: string}} buildPath
 * @returns {RollupOptions} bundle size result, `gzip`
 */
function getBundleSizeConfig({ devBuildPath, productionBuildPath }) {
    return {
        input: [devBuildPath, productionBuildPath],
        plugins: [bundleSizePlugin()],
    }
}

/**@type {"index"} */
const entryPoint = "index"

/**
 * @param {*} args
 * @returns {RollupOptions[]} rollup build config
 */
export default function (args) {
    return [
        getTypeDefConfig({
            input: `packages/${entryPoint}.ts`,
            output: "dist",
        }),
        getESMConfig({
            input: `packages/${entryPoint}.ts`,
            output: `dist/dev/${entryPoint}`,
            env: "development",
        }),
        getESMConfig({
            input: `packages/utils/${entryPoint}.ts`,
            output: `dist/dev/utils/${entryPoint}`,
            env: "development",
        }),
        getESMConfig({
            input: `packages/${entryPoint}.ts`,
            output: `dist/${entryPoint}`,
            env: "production",
        }),
        getBundleSizeConfig({
            devBuildPath: `dist/dev/${entryPoint}.js`,
            productionBuildPath: `dist/${entryPoint}.js`,
        }),
    ]
}
