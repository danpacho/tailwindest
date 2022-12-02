import { describe, expect, test } from "@jest/globals"
import { getTailwindClass } from "../../packages/core"
import { label } from "../label"

describe(label.unit("getTailwindClass"), () => {
    test(
        label.case("flatten stylesheet and join into classname string"),
        () => {
            const indent = " "
            const nestedStyleObject = {
                a: "a",
                b: {
                    c: {
                        d: {
                            eNull: null,
                            e: {
                                f: "f",
                            },
                            gUndefined: undefined,
                            g: {
                                h: {
                                    i: "i",
                                },
                                j: "j",
                                k: {
                                    l: {
                                        m: "m",
                                    },
                                },
                            },
                        },
                        nFalsy: 0,
                        n: {
                            o: {
                                p: "p",
                            },
                            q: "q",
                            qFalse: false,
                        },
                    },
                    rFalsyArray: [
                        false,
                        undefined,
                        null,
                        NaN,
                        Number.isNaN(NaN),
                        0,
                    ],
                    r: "r",
                    s: {
                        t: "t",
                        w: {
                            x: {
                                y: "y",
                            },
                            z: "z",
                        },
                    },
                },
            }

            expect(getTailwindClass(nestedStyleObject)).toBe(
                `a${indent}f${indent}i${indent}j${indent}m${indent}p${indent}q${indent}r${indent}t${indent}y${indent}z`
            )
        }
    )
    test(label.case("impossible nested object"), () => {
        const impossibleNestedObjectClassName = getTailwindClass({
            a: {
                b: {
                    c: {
                        d: {
                            e: {
                                f: {
                                    g: {
                                        h: {
                                            i: {
                                                j: {
                                                    k: {
                                                        l: {
                                                            m: {
                                                                n: {
                                                                    o: {
                                                                        p: {
                                                                            q: {
                                                                                r: {
                                                                                    s: {
                                                                                        t: {
                                                                                            u: {
                                                                                                v: {
                                                                                                    w: {
                                                                                                        x: {
                                                                                                            y: {
                                                                                                                z: {
                                                                                                                    A: {
                                                                                                                        B: {
                                                                                                                            C: {
                                                                                                                                D: {
                                                                                                                                    E: {
                                                                                                                                        F: {
                                                                                                                                            G: {
                                                                                                                                                H: {
                                                                                                                                                    I: "IamIronMan",
                                                                                                                                                },
                                                                                                                                            },
                                                                                                                                        },
                                                                                                                                    },
                                                                                                                                },
                                                                                                                            },
                                                                                                                        },
                                                                                                                    },
                                                                                                                },
                                                                                                            },
                                                                                                        },
                                                                                                    },
                                                                                                },
                                                                                            },
                                                                                        },
                                                                                    },
                                                                                },
                                                                            },
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        })
        expect(impossibleNestedObjectClassName).toBe("IamIronMan")
    })
})
