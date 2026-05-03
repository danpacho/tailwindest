import { fileURLToPath } from "url"
import { dirname } from "path"

declare const __filename: string

const filename =
    typeof import.meta.url === "string"
        ? fileURLToPath(import.meta.url)
        : __filename
export const baseDir = dirname(filename)
