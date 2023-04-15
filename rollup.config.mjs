//@ts-check

import path from "path"
import { fileURLToPath } from "url"
import typescript from "@rollup/plugin-typescript"
import dts from "rollup-plugin-dts"
import esbuild from "rollup-plugin-esbuild"
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
    //FIXME: __filename is not defined error
    // https://github.com/rollup/plugins/issues/1366
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    global["__filename"] = fileURLToPath(import.meta.url)

    return {
        input,
        output: [{ file: `${output}.js`, format: "esm" }],
        plugins: [getEsbuildPlugin("node14", env)],
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
 * @param {{devBuildPath: string, productionBuildPath: string, outputWatchPath: string}} buildPath
 * @returns {RollupOptions} bundle size result, `gzip`
 */
function getBundleSizeConfig({
    devBuildPath,
    productionBuildPath,
    outputWatchPath,
}) {
    return {
        input: [devBuildPath, productionBuildPath],
        output: {
            dir: outputWatchPath,
        },
        plugins: [bundleSizePlugin()],
    }
}

/**
 * @param {{bundleSourcePath: string, bundleResultPath: string}} buildTypePath
 * @returns {RollupOptions} bundle size result, `gzip`
 */
function getBundleTypeDefConfig({ bundleSourcePath, bundleResultPath }) {
    return {
        input: bundleSourcePath,
        output: [{ file: bundleResultPath, format: "es" }],
        plugins: [dts()],
    }
}

const PATH = {
    entryPoint: "index",
    entryDir: "packages",
    outputGzipDir: "dist/gzip",
    outputDir: "dist",
    watchDir: "dist/watch",
}

/**
 * @param {*} args
 * @returns {RollupOptions[]} rollup build config
 */
export default function (args) {
    return [
        getTypeDefConfig({
            input: `${PATH.entryDir}/${PATH.entryPoint}.ts`,
            output: PATH.outputDir,
        }),
        getESMConfig({
            input: `${PATH.entryDir}/${PATH.entryPoint}.ts`,
            output: `${PATH.outputGzipDir}/${PATH.entryPoint}`,
            env: "production",
        }),
        getESMConfig({
            input: `${PATH.entryDir}/${PATH.entryPoint}.ts`,
            output: `${PATH.outputDir}/${PATH.entryPoint}`,
            env: "development",
        }),
        getBundleTypeDefConfig({
            bundleSourcePath: `${PATH.outputDir}/${PATH.entryPoint}.d.ts`,
            bundleResultPath: `${PATH.outputDir}/${PATH.entryPoint}.d.ts`,
        }),
        getBundleSizeConfig({
            devBuildPath: `${PATH.outputDir}/${PATH.entryPoint}.js`,
            productionBuildPath: `${PATH.outputGzipDir}/${PATH.entryPoint}.js`,
            outputWatchPath: PATH.watchDir,
        }),
    ]
}
