import { normalizeCandidateFileId } from "../tailwind/manifest"

export interface CachedSource {
    id: string
    code: string
    hash: string
}

export class SourceCache {
    private readonly files = new Map<string, CachedSource>()

    public set(id: string, code: string, hash: string): CachedSource {
        const normalized = normalizeCandidateFileId(id)
        const cached = { id: normalized, code, hash }
        this.files.set(normalized, cached)
        return cached
    }

    public get(id: string): CachedSource | undefined {
        return this.files.get(normalizeCandidateFileId(id))
    }

    public delete(id: string): void {
        this.files.delete(normalizeCandidateFileId(id))
    }

    public entries(): CachedSource[] {
        return [...this.files.values()].sort((left, right) =>
            left.id.localeCompare(right.id)
        )
    }
}
