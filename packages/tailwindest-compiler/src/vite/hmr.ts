import { normalizeCandidateFileId } from "../tailwind/manifest"
import type { CompilerContext } from "./context"

export interface ViteLikeModule {
    id?: string | null
}

export interface ViteLikeServer {
    moduleGraph: {
        idToModuleMap?: Map<string, ViteLikeModule>
        getModuleById?: (id: string) => ViteLikeModule | undefined
        invalidateModule: (module: ViteLikeModule) => void
    }
}

export interface HotUpdateInput {
    file: string
    timestamp?: number
    modules?: ViteLikeModule[]
    server: ViteLikeServer
    read?: () => string | Promise<string>
}

export function createHotUpdateHandler(context: CompilerContext) {
    return async ({
        file,
        server,
        read,
    }: HotUpdateInput): Promise<ViteLikeModule[]> => {
        const changedFile = normalizeCandidateFileId(file)
        context.takeReprocessedJsIds()
        if (isJsId(changedFile)) {
            if (read) {
                try {
                    context.transformJs(await read(), changedFile)
                } catch {
                    context.removeFile(changedFile)
                }
            } else {
                context.removeFile(changedFile)
            }
        } else if (isCssId(changedFile) && read) {
            try {
                await context.transformCssAsync(await read(), changedFile)
            } catch {
                context.removeFile(changedFile)
            }
        }

        const reprocessedJsIds = context.takeReprocessedJsIds()
        const affectedIds = [
            ...new Set([
                changedFile,
                ...context.getReverseDependencies(changedFile),
                ...reprocessedJsIds,
            ]),
        ]
        const affectedModules =
            affectedIds.length > 0
                ? affectedIds
                      .map((id) => server.moduleGraph.getModuleById?.(id))
                      .filter(isModule)
                : getAllKnownModules(server)
        const modulesToInvalidate =
            affectedModules.length > 0
                ? affectedModules
                : getAllKnownModules(server)

        const invalidatedModules = new Set<ViteLikeModule>()

        if (context.shouldInvalidateCssForManifest()) {
            invalidateCssEntries(context, server, invalidatedModules)
        }
        for (const module of modulesToInvalidate) {
            if (invalidatedModules.has(module)) {
                continue
            }
            server.moduleGraph.invalidateModule(module)
            invalidatedModules.add(module)
        }

        return modulesToInvalidate
    }
}

export function invalidateCssEntries(
    context: CompilerContext,
    server: ViteLikeServer,
    invalidatedModules = new Set<ViteLikeModule>()
): void {
    for (const cssEntry of context.getCssEntries()) {
        const module = server.moduleGraph.getModuleById?.(cssEntry)
        if (module && !invalidatedModules.has(module)) {
            server.moduleGraph.invalidateModule(module)
            invalidatedModules.add(module)
        }
    }
}

function getAllKnownModules(server: ViteLikeServer): ViteLikeModule[] {
    return [...(server.moduleGraph.idToModuleMap?.values() ?? [])]
}

function isModule(
    module: ViteLikeModule | undefined
): module is ViteLikeModule {
    return Boolean(module)
}

function isJsId(id: string): boolean {
    return /\.[cm]?[jt]sx?$/.test(id)
}

function isCssId(id: string): boolean {
    return /\.css$/.test(id)
}
