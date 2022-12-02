import { describe, expect, test } from "@jest/globals"
import type { NestedObject } from "../packages/core/nested.object.type"
import { wind } from "../packages/wind"
import { label } from "./label"

const base: NestedObject = {
    a: "a",
    b: {
        c: "c",
        d: {
            e: "e",
            f: {
                g: "g",
                h: {
                    i: "i",
                    j: {
                        k: "k",
                        l: {
                            m: "m",
                            n: {
                                o: "o",
                                p: {
                                    q: "q",
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    r: {
        s: "s",
        t: {
            u: "u",
            v: {
                w: "w",
                x: {
                    y: "y",
                },
            },
        },
    },
    z: "z",
}
const bulkWind = wind(base, {
    variant: {
        b: {
            c: "c_is_replaced",
            d: "d_is_replaced",
        },
        addedObject: {
            value: "addedString1",
        },
        addedString: "addedString2",
        skipFalsy1: false,
        skipFalsy2: undefined,
    },
})

const bulkComposeWind = wind(
    {
        a: {
            b: {
                c: "original1",
            },
        },
    } as NestedObject,
    {
        willBeRemoved: {
            a: {
                b: {
                    c: "c_variant",
                },
            },
        },
    }
).compose(
    {
        a: {
            b: {
                c: "removed1",
            },
            d: null,
        },
    },
    {
        a: {
            b: {
                c: "removed2",
            },
            d: undefined,
        },
    },
    {
        a: {
            b: {
                c: "removed3",
            },
            d: false,
        },
    },
    {
        a: {
            b: {
                c: "removed4",
            },
            d: "added",
        },
    },
    {
        a: {
            b: null,
            d: 777, // number will be ignored
        },
    },
    {
        a: {
            b: {
                c: "composed",
            },
        },
    }
)

const cachedClass = bulkWind.class()
const cachedStyle = bulkWind.style()

const cachedVariantClass = bulkWind.class("variant")
const cachedVariantStyle = bulkWind.style("variant")

const cachedComposedClass = bulkComposeWind.class()
const cachedComposedStyle = bulkComposeWind.style()

const cachedComposedVariantClass = bulkComposeWind.class("willBeRemoved")
const cachedComposedVariantStyle = bulkComposeWind.style("willBeRemoved")

describe(label.unit("wind - class string"), () => {
    test(label.case("default"), () => {
        expect(cachedClass).toBe("a c e g i k m o q s u w y z")
    })
    test(label.case("variant"), () => {
        expect(cachedVariantClass).toBe(
            "a c_is_replaced d_is_replaced s u w y z addedString1 addedString2"
        )
    })
    test(label.case("composed"), () => {
        expect(cachedComposedClass).toBe("composed added")
    })
    test(label.case("composed variant"), () => {
        expect(cachedComposedVariantClass).toBe("c_variant added")
    })
})

describe(label.unit("wind - stylesheet"), () => {
    test(label.case("default"), () => {
        expect(cachedStyle).toEqual(base)
    })
    test(label.case("variant"), () => {
        expect(cachedVariantStyle).toEqual({
            a: "a",
            b: {
                c: "c_is_replaced",
                d: "d_is_replaced",
            },
            r: {
                s: "s",
                t: {
                    u: "u",
                    v: {
                        w: "w",
                        x: {
                            y: "y",
                        },
                    },
                },
            },
            z: "z",
            addedObject: {
                value: "addedString1",
            },
            addedString: "addedString2",
            skipFalsy1: false,
            skipFalsy2: undefined,
        })
    })
    test(label.case("composed"), () => {
        expect(cachedComposedStyle).toEqual({
            a: {
                b: {
                    c: "composed",
                },
                d: "added",
            },
        })
    })
    test(label.case("composed variant"), () => {
        expect(cachedComposedVariantStyle).toEqual({
            a: {
                b: {
                    c: "c_variant",
                },
                d: "added",
            },
        })
    })
})

describe(label.unit("wind - cache"), () => {
    const cacheAccessCount = 1000

    test(label.case("default"), () => {
        for (let i = 0; i < cacheAccessCount; i++) {
            expect(bulkWind.class()).toBe(cachedClass)
            expect(bulkWind.style()).toEqual(cachedStyle)
        }
    })

    test(label.case("variant"), () => {
        for (let i = 0; i < cacheAccessCount; i++) {
            expect(bulkWind.class("variant")).toBe(cachedVariantClass)
            expect(bulkWind.style("variant")).toEqual(cachedVariantStyle)
        }
    })

    test(label.case("composed"), () => {
        for (let i = 0; i < cacheAccessCount; i++) {
            expect(bulkComposeWind.class()).toBe(cachedComposedClass)
            expect(bulkComposeWind.style()).toEqual(cachedComposedStyle)
        }
    })

    test(label.case("variant composed"), () => {
        for (let i = 0; i < cacheAccessCount; i++) {
            expect(bulkComposeWind.class("willBeRemoved")).toBe(
                cachedComposedVariantClass
            )
            expect(bulkComposeWind.style("willBeRemoved")).toEqual(
                cachedComposedVariantStyle
            )
        }
    })
})
