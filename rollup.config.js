import path from "path"
import typescript from "@rollup/plugin-typescript"
import esbuild from "rollup-plugin-esbuild"
import { terser } from "rollup-plugin-terser"

function EsbuildPlugin(target, env = "development") {
    return esbuild({
        minify: env === "production",
        target,
        tsconfig: path.resolve("./tsconfig.json"),
    })
}

function ESMConfig(input, output, env) {
    return {
        input,
        output: [{ file: `${output}.js`, format: "esm" }],
        plugins: [
            EsbuildPlugin("node14", env),
            env === "production" ? terser() : [],
        ],
    }
}

function TypeDefConfig(input, output) {
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

const entryPoint = "index"
export default function (args) {
    return [
        TypeDefConfig(`packages/${entryPoint}.ts`, "dist"),
        ESMConfig(
            `packages/${entryPoint}.ts`,
            `dist/dev/${entryPoint}`,
            "development"
        ),
        ESMConfig(
            `packages/${entryPoint}.ts`,
            `dist/${entryPoint}`,
            "production"
        ),
    ]
}
