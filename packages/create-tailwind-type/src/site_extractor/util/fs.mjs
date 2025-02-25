import fs from "fs/promises"
import path from "node:path"

/**
 * Checks if a file or directory exists at a given path.
 * @async
 * @function
 * @name fileExists
 * @param {string} targetPath - The path to check.
 * @returns {Promise<boolean>} - Resolves to `true` if the path exists, otherwise `false`.
 */
export async function fileExists(targetPath) {
    try {
        await fs.access(targetPath)
        return true
    } catch {
        return false
    }
}

/**
 * Ensures a directory exists at the provided path, creating it if necessary.
 * @async
 * @function
 * @name ensureDirectoryExists
 * @param {string} dirPath - The directory path to ensure.
 * @returns {Promise<void>} - Resolves when the directory is ensured.
 */
export async function ensureDirectoryExists(dirPath) {
    const exists = await fileExists(dirPath)
    if (!exists) {
        await fs.mkdir(dirPath, { recursive: true })
    }
}

/**
 * Ensures that the file exists at the provided path by creating an empty file if it doesn't.
 * Also ensures the directory for that file exists.
 * @async
 * @function
 * @name ensureFileExists
 * @param {string} filePath - The file path to ensure.
 * @returns {Promise<void>} - Resolves when the file is ensured.
 */
export async function ensureFileExists(filePath) {
    const dir = path.dirname(filePath)
    await ensureDirectoryExists(dir)

    // Attempt to create the file if it doesn't exist
    const exists = await fileExists(filePath)
    if (!exists) {
        await fs.writeFile(filePath, "")
    }
}
