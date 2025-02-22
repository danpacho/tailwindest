import { describe, expect, it } from "vitest"

const hello = (name: string) => `Hello ${name}!`

describe("logger test", () => {
    it("should be apple", () => {
        const apple = "apple"
        const hiApple = hello(apple)
        expect(hiApple).toBe("Hello apple!")
    })
})
