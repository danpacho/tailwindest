import { createCompilerContext, type TailwindestViteOptions } from "./context"
import {
    createHotUpdateHandler,
    invalidateCssEntries,
    type ViteLikeServer,
} from "./hmr"

type ViteTransformHandler = (
    this: unknown,
    code: string,
    id: string
) =>
    | Promise<{ code: string; map: unknown } | null>
    | { code: string; map: unknown }
    | null
type WatchChangeHandler = (
    this: unknown,
    id: string,
    change: { event: "create" | "update" | "delete" }
) => void

interface TailwindestPlugin {
    name: string
    enforce: "pre"
    configResolved?: (config: {
        root: string
        command: "serve" | "build"
    }) => void
    buildStart?: () => Promise<void>
    configureServer?: (server: ViteLikeServer) => Promise<void>
    handleHotUpdate?: ReturnType<typeof createHotUpdateHandler>
    watchChange?: WatchChangeHandler
    transform: {
        filter: { id: RegExp }
        handler: ViteTransformHandler
    }
}

export function tailwindest(
    options: TailwindestViteOptions = {}
): [TailwindestPlugin, TailwindestPlugin] {
    const context = createCompilerContext({
        root: process.cwd(),
        options,
    })
    const hotUpdate = createHotUpdateHandler(context)
    let devServer: ViteLikeServer | undefined

    const applyConfig = (config: {
        root: string
        command: "serve" | "build"
    }) => {
        context.updateRoot(config.root)
    }

    const transformPlugin: TailwindestPlugin = {
        name: "tailwindest:transform",
        enforce: "pre",
        configResolved: applyConfig,
        buildStart: () => context.preScan(),
        configureServer(server) {
            devServer = server
            return context.preScan()
        },
        handleHotUpdate: hotUpdate,
        watchChange(id, change) {
            if (change.event === "delete") {
                const changed = context.removeFile(id)
                if (changed && devServer) {
                    invalidateCssEntries(context, devServer)
                }
            }
        },
        transform: {
            filter: { id: /\.[cm]?[jt]sx?(?:[?#].*)?$/ },
            handler(code, id) {
                if (!context.shouldTransformJs(id)) {
                    return null
                }
                const result = context.transformJs(code, id)
                return result.changed || result.map
                    ? { code: result.code, map: result.map }
                    : null
            },
        },
    }

    const sourcePlugin: TailwindestPlugin = {
        name: "tailwindest:source",
        enforce: "pre",
        configResolved: applyConfig,
        transform: {
            filter: { id: /\.css(?:[?#].*)?$/ },
            handler(code, id) {
                const result = context.transformCss(code, id)
                return result.code === code ? null : result
            },
        },
    }

    return [transformPlugin, sourcePlugin]
}

export type { TailwindestViteOptions }
