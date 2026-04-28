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
        }

        const affectedIds = [
            ...new Set([
                changedFile,
                ...context.getReverseDependencies(changedFile),
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

        if (context.shouldInvalidateCssForManifest()) {
            invalidateCssEntries(context, server)
        }

        for (const module of modulesToInvalidate) {
            server.moduleGraph.invalidateModule(module)
        }

        return modulesToInvalidate
    }
}

export function invalidateCssEntries(
    context: CompilerContext,
    server: ViteLikeServer
): void {
    for (const cssEntry of context.getCssEntries()) {
        const module = server.moduleGraph.getModuleById?.(cssEntry)
        if (module) {
            server.moduleGraph.invalidateModule(module)
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
