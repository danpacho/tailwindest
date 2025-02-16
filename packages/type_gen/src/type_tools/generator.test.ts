import { describe, it, expect } from "vitest"
import * as t from "./"

function normalize(str: string): string {
    return str.replace(/\s+/g, " ").trim()
}

describe("TypeSchemaGenerator", () => {
    const generator = new t.TypeSchemaGenerator()

    // ───────────────────────────────
    // Primitive Types
    // ───────────────────────────────
    describe("Primitive Types", () => {
        it("generates type alias for number with alias", async () => {
            const prim = t.number("MyNumber")
            const result = await generator.generate(prim)
            const expected = `type MyNumber = number;`
            expect(normalize(result)).toBe(normalize(expected))
        })

        it("generates type alias for string with alias", async () => {
            const prim = t.string("MyString")
            const result = await generator.generate(prim)
            const expected = `type MyString = string;`
            expect(normalize(result)).toBe(normalize(expected))
        })

        it("generates type alias for boolean with alias", async () => {
            const prim = t.boolean("MyBoolean")
            const result = await generator.generate(prim)
            const expected = `type MyBoolean = boolean;`
            expect(normalize(result)).toBe(normalize(expected))
        })
    })

    // ───────────────────────────────
    // Literal Types
    // ───────────────────────────────
    describe("Literal Types", () => {
        it("generates union of literal types without alias", async () => {
            const unionLiterals = t.union([
                t.literal("hello"),
                t.literal("world"),
            ])
            const result = await generator.generate(unionLiterals)
            const expected = `"hello" | "world";`
            expect(normalize(result)).toBe(normalize(expected))
        })

        it("generates type alias for literal type with alias", async () => {
            const lit = t.literal("TEST", { alias: "TestLiteral" })
            const result = await generator.generate(lit)
            const expected = `type TestLiteral = "TEST";`
            expect(normalize(result)).toBe(normalize(expected))
        })

        it("generates backtick literal types", async () => {
            const lit = t.literal("kind-${string}", {
                alias: "LiteralString",
                useBackticks: true,
            })
            const result = await generator.generate(lit)
            const expected = "type LiteralString = `kind-${string}`;"
            expect(normalize(result)).toBe(normalize(expected))
        })
    })

    // ───────────────────────────────
    // Array Types
    // ───────────────────────────────
    describe("Array Types", () => {
        it("generates type alias for an array of numbers", async () => {
            const arr = t.array(t.number("MyNumber"), "MyArray")
            const result = await generator.generate(arr)
            const expected = `type MyNumber = number; type MyArray = Array<MyNumber>;`
            expect(normalize(result)).toBe(normalize(expected))
        })

        it("generates nested array type without alias", async () => {
            const arr = t.array(t.string())
            const result = await generator.generate(arr)
            const expected = `Array<string>;`
            expect(normalize(result)).toBe(normalize(expected))
        })
    })

    // ───────────────────────────────
    // Union Types
    // ───────────────────────────────
    describe("Union Types", () => {
        it("generates correct union of literal types", async () => {
            const schemaWithoutAlias = t.union([
                t.literal("ace"),
                t.literal("bool"),
            ])
            const schemaWithAlias = t.union(
                [t.literal("ace"), t.literal("bool")],
                "WithAlias"
            )
            const generated = await generator.generate(schemaWithoutAlias)
            const generatedAlias = await generator.generate(schemaWithAlias)

            const expected = `"ace" | "bool";`
            const expectedAlias = `type WithAlias = "ace" | "bool";`
            expect(normalize(generated)).toBe(normalize(expected))
            expect(normalize(generatedAlias)).toBe(normalize(expectedAlias))
        })

        it("generates union of primitives with aliases", async () => {
            const unionPrim = t.union(
                [t.number("NumA"), t.string("StrB")],
                "UnionPrim"
            )
            const result = await generator.generate(unionPrim)
            const expected = `type NumA = number; type StrB = string; type UnionPrim = NumA | StrB;`
            expect(normalize(result)).toBe(normalize(expected))
        })
    })

    // ───────────────────────────────
    // Intersection Types
    // ───────────────────────────────
    describe("Intersection Types", () => {
        it("generates intersection of records with aliases", async () => {
            const inter = t.intersection(
                [
                    t.record({ a: t.number("NumA") }),
                    t.record({ b: t.string("StrB") }),
                ],
                "InterRec"
            )
            const result = await generator.generate(inter)
            const expected =
                "type NumA = number; type StrB = string; type InterRec = { a: NumA; } & { b: StrB; };"
            expect(normalize(result)).toBe(normalize(expected))
        })

        it("generates intersection without alias", async () => {
            const inter = t.intersection(
                [t.record({ a: t.boolean() }), t.record({ b: t.literal("x") })],
                "Intersection"
            )
            const result = await generator.generate(inter)
            const expected = `type Intersection = { a: boolean; } & { b: "x"; };`
            expect(normalize(result)).toBe(normalize(expected))
        })
    })

    // ───────────────────────────────
    // Record Types
    // ───────────────────────────────
    describe("Record Types", () => {
        it("generates inline record type with field aliases", async () => {
            const recType = t.record(
                "Record",
                {
                    foo: t.number("MyNumber"),
                    bar: t.string("MyString"),
                },
                { keyword: "type" }
            )
            const result = await generator.generate(recType)
            const expected =
                "type MyNumber = number; type MyString = string; type Record = { foo: MyNumber; bar: MyString; };"
            expect(normalize(result)).toBe(normalize(expected))
        })

        it("generates inline record interface with field aliases", async () => {
            const recInterface = t.record(
                "Record",
                {
                    foo: t.number("MyNumber"),
                    bar: t.string("MyString"),
                },
                { keyword: "interface" }
            )
            const result = await generator.generate(recInterface)
            const expected =
                "type MyNumber = number; type MyString = string; interface Record { foo: MyNumber; bar: MyString; }"
            expect(normalize(result)).toBe(normalize(expected))
        })

        it("generates named record type with generics and nested composite types", async () => {
            const schema = t.record(
                "RecordType",
                {
                    name: "A",
                    age: "B",
                    lists: t.union(
                        [
                            "A",
                            "B",
                            t.array(
                                t.union(
                                    ["A", "B", t.number("AliasNumber")],
                                    "Union",
                                    ["A", "B"]
                                ),
                                "AliasArray",
                                ["A", "B"]
                            ),
                            t.literal("LITERAL", { alias: "AliasedLiteral" }),
                        ],
                        "List",
                        [
                            "A",
                            {
                                name: "B",
                                extends: "Array<number>",
                                default: "number[]",
                            },
                        ]
                    ),
                    intersection: t.intersection([
                        t.record({ name: t.string("AliasString") }),
                        t.record({ age: t.number() }),
                    ]),
                },
                {
                    generic: [
                        "A",
                        { name: "B", extends: "number[]", default: "number[]" },
                    ],
                }
            )
            const result = await generator.generate(schema)
            expect(normalize(result)).toMatchInlineSnapshot(
                `"type AliasNumber = number; type Union<A, B> = A | B | AliasNumber; type AliasArray<A, B> = Array<Union<A, B>>; type AliasedLiteral = "LITERAL"; type List<A, B extends Array<number> = number[]> = | A | B | AliasArray<A, B> | AliasedLiteral; type AliasString = string; type RecordType<A, B extends number[] = number[]> = { name: A; age: B; lists: List<A, B>; intersection: { name: AliasString; } & { age: number; }; };"`
            )
        })
    })

    // ───────────────────────────────
    // Generic Types
    // ───────────────────────────────
    describe("Generic Types", () => {
        it("generates generic simple generic lists", async () => {
            const schema = t.array(
                t.union([t.string(), t.number(), "A", "B", "C"]),
                "GenericArray",
                ["A", "B", "C"]
            )
            const result = await generator.generate(schema)
            expect(normalize(result)).toBe(
                "type GenericArray<A, B, C> = Array<string | number | A | B | C>;"
            )
        })

        it("generates generic named with default generic lists", async () => {
            const schema = t.array(
                t.union([t.string(), t.number(), "A", "B", "C"]),
                "GenericArray",
                [
                    { name: "A", extends: "number" },
                    { name: "B", extends: "string", default: "string" },
                    {
                        name: "C",
                        extends: "Array<string>",
                        default: "string[]",
                    },
                ]
            )
            const result = await generator.generate(schema)
            expect(normalize(result)).toBe(
                "type GenericArray< A extends number, B extends string = string, C extends Array<string> = string[], > = Array<string | number | A | B | C>;"
            )
        })
    })

    // ───────────────────────────────
    // JSDoc Documentation Feature
    // ───────────────────────────────
    describe("JSDoc Documentation", () => {
        const generator = new t.TypeSchemaGenerator()

        it("stores a single-argument addDoc under @description", async () => {
            const prim = t.boolean("MyBool").addDoc("This is a boolean type.")
            const result = await generator.generate(prim)
            expect(result).toMatchInlineSnapshot(`
              "/** This is a boolean type. */
              type MyBool = boolean;
              "
            `)
        })

        it("includes JSDoc comment for primitive type alias with key", async () => {
            const num = t
                .number("MyNumber")
                .addDoc("title", "This is a special number type.")
            const result = await generator.generate(num)
            expect(result).toMatchInlineSnapshot(`
              "/** This is a special number type. */
              type MyNumber = number;
              "
            `)
        })

        it("attaches JSDoc to a record type", async () => {
            const rec = t
                .record("User", {
                    id: t.number(),
                    name: t.string(),
                })
                .addDoc(
                    "@description",
                    "User type representing an application user."
                )
            const result = await generator.generate(rec)
            expect(result).toMatchInlineSnapshot(`
              "/** User type representing an application user. */
              type User = {
                id: number;
                name: string;
              };
              "
            `)
        })

        it("formats complex @example JSDoc with language option", async () => {
            const cssExample = `.dark:bg-red-700 {
        @media (prefers-color-scheme: dark) {
          background-color: var(--color-red-700);
        }
      }`
            const schema = t
                .array(t.string(), "ArrType")
                .addDoc("title", "ArrType is a specific type")
                .addDoc("@returns", "It returns some kind of array")
                .addDoc("@example", cssExample, { lang: "css" })
            const result = await generator.generate(schema)
            expect(result).toMatchInlineSnapshot(`
              "/**
               * ArrType is a specific type
               *
               * @returns It returns some kind of array
               *
               *   @example
               *
               *   \`\`\`css
               *   .dark:bg-red-700 {
               *     \\@media (prefers-color-scheme: dark) {
               *       background-color: var(--color-red-700);
               *     }
               *   }
               *   \`\`\`
               */
              type ArrType = Array<string>;
              "
            `)
        })

        it("chains multiple addDoc calls correctly", async () => {
            const rec = t
                .record("ChainedType", { value: t.number("Num") })
                .addDoc("title", "ChainedType title")
                .addDoc("@param", "value - a number value")
                .addDoc("@example", "const x = 1;", { lang: "ts" })
            const result = await generator.generate(rec)
            expect(result).toMatchInlineSnapshot(`
              "type Num = number;
              /**
               * ChainedType title
               *
               * @param value - a number value
               *
               *   @example
               *
               *   \`\`\`ts
               *   const x = 1;
               *   \`\`\`
               */
              type ChainedType = {
                value: Num;
              };
              "
            `)
        })
    })
})
