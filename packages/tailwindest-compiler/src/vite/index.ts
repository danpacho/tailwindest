import { createCompilerContext, type TailwindestViteOptions } from "./context"
import {
    createHotUpdateHandler,
    invalidateCssEntries,
    type ViteLikeServer,
} from "./hmr"

/**
 * @deprecated Internal compiler experiment. `@tailwindest/compiler/vite` is
 * private and must not be published.
 * @internal
 */

/**
 * Structural Vite transform handler type used by the Tailwindest plugin.
 *
 * @deprecated Internal compiler experiment.
 * @internal
 */
export type ViteTransformHandler = (
    this: unknown,
    code: string,
    id: string
) =>
    | Promise<{ code: string; map: unknown } | null>
    | { code: string; map: unknown }
    | null

/**
 * Structural watch-change hook used to remove deleted files from the manifest
 * bridge during development.
 *
 * @deprecated Internal compiler experiment.
 * @internal
 */
export type WatchChangeHandler = (
    this: unknown,
    id: string,
    change: { event: "create" | "update" | "delete" }
) => void

/**
 * Structural hot-update handler exposed on the transform plugin.
 *
 * @deprecated Internal compiler experiment.
 * @internal
 */
export type ViteHotUpdateHandler = (input: {
    file: string
    timestamp?: number
    modules?: unknown[]
    server: unknown
    read?: () => string | Promise<string>
}) => Promise<unknown[]>

/**
 * Internal plugin shape returned by `tailwindest()`.
 *
 * The tuple returned by `tailwindest()` contains two Vite plugins:
 *
 * 1. `tailwindest:transform` compiles Tailwindest calls and updates the
 *    candidate manifest.
 * 2. `tailwindest:source` injects the manifest into Tailwind CSS via
 *    `@source inline()`.
 *
 * @deprecated Internal compiler experiment.
 * @internal
 */
export interface TailwindestPlugin {
    name: string
    enforce: "pre"
    configResolved?: (config: {
        root: string
        command: "serve" | "build"
    }) => void
    buildStart?: () => Promise<void>
    configureServer?: (server: unknown) => Promise<void>
    handleHotUpdate?: ViteHotUpdateHandler
    watchChange?: WatchChangeHandler
    transform: {
        filter: { id: RegExp }
        handler: ViteTransformHandler
    }
}

/**
 * Create the Tailwindest Vite plugin pair.
 *
 * @deprecated Internal compiler experiment.
 * @internal
 */
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
            devServer = server as never
            return context.preScan()
        },
        handleHotUpdate: hotUpdate as ViteHotUpdateHandler,
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
            async handler(code, id) {
                if (!context.shouldTransformJs(id)) {
                    return null
                }
                await context.ensureVariantResolverReady()
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
            async handler(code, id) {
                const result = await context.transformCssAsync(code, id)
                return result.code === code ? null : result
            },
        },
    }

    return [transformPlugin, sourcePlugin]
}

/**
 * @deprecated Internal compiler experiment.
 * @internal
 */
export type { TailwindestViteOptions }
