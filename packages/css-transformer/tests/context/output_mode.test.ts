import { describe, expect, it } from "vitest"
import { resolveOutputMode } from "../../src/context/output_mode"

describe("resolveOutputMode", () => {
    it("uses explicit runtime mode", async () => {
        const result = await resolveOutputMode({ outputMode: "runtime" })

        expect(result.requestedMode).toBe("runtime")
        expect(result.mode).toBe("runtime")
        expect(result.evidence[0]?.kind).toBe("explicit-option")
        expect(result.diagnostics).toEqual([])
    })

    it("defaults auto mode to runtime output", async () => {
        const result = await resolveOutputMode()

        expect(result.requestedMode).toBe("auto")
        expect(result.mode).toBe("runtime")
        expect(result.evidence).toEqual([])
        expect(result.diagnostics).toEqual([])
    })

    it("rejects unsupported output modes", async () => {
        await expect(
            resolveOutputMode({ outputMode: "static" as never })
        ).rejects.toThrow("Invalid output mode: static")
    })
})
