import { describe, expect, it } from "vitest"
import {
    backgroundBlendMode,
    backgroundColor,
    backgroundImage,
    display,
    placeItems,
} from "./__mocks__/collection"

interface TailwindCollectionRecord {
    propertyName: string
    classNames: Array<string>
    variants: Array<string>
}

interface OptimizableMap {
    propertyName: string
    hasNegative: boolean
    soleGroups: Array<string>
    prefixGroups: Array<string>
    valueGroups: Array<string>
    variants: Array<string> | null
    prefixValueMapping: Array<{
        prefix: string
        values: Array<string>
        hasNegative: boolean
    }>
    valueReferenceMap: Map<string, Array<string>>
}

function createOptimizableMap(
    collectionRecord: TailwindCollectionRecord,
    prefixRules: Array<(someText: string) => boolean> = []
): OptimizableMap {
    const {
        propertyName,
        classNames: originalClassNames,
        variants,
    } = collectionRecord

    const hasNegative = originalClassNames.some((className) =>
        className.startsWith("-")
    )

    // Purify class names if negative values exist
    let classNames: string[] = []
    if (hasNegative) {
        classNames = originalClassNames.map((e) =>
            e.startsWith("-") ? e.slice(1) : e
        )
    } else {
        classNames = originalClassNames
    }

    const findPrefixGroups = (
        classGroups: string[],
        parentPrefix: string[]
    ): string[] => {
        const uniquePrefixTokens = Array.from(
            new Set(
                classGroups
                    .map((e) => {
                        const splitted = e.split("-")

                        if (splitted.length === 1) {
                            return null
                        }

                        const possiblePrefix = splitted[0]
                        if (!possiblePrefix) return null

                        const isNotPrefix = prefixRules.some(
                            (rule) => rule(possiblePrefix) === false
                        )
                        if (isNotPrefix) return null

                        return possiblePrefix
                    })
                    .filter((e) => Boolean(e) && e !== "")
            )
        )

        if (uniquePrefixTokens.length === 0) return []
        if (classGroups.length === 0) return []

        const matchedPrefixes = uniquePrefixTokens.reduce<string[]>(
            (matched, token) => {
                if (!token) return matched

                const matchingCount = classGroups.reduce((count, className) => {
                    if (className.includes(token)) {
                        return count + 1
                    }
                    return count
                }, 0)

                if (matchingCount > 2) {
                    matched.push(token)
                }

                return matched
            },
            []
        )
        const parentRemovedPrefixes = matchedPrefixes.filter(
            (e) => parentPrefix.includes(e) === false
        )
        if (parentRemovedPrefixes.length === 0) return []

        const prefixGroups = parentRemovedPrefixes.reduce<string[][]>(
            (recursiveCollected, prefix) => {
                const group: string[] = classGroups.reduce<string[]>(
                    (groupList, className) => {
                        if (className.includes(prefix)) {
                            const childrenToken = className.replace(
                                `${prefix}-`,
                                ""
                            )
                            groupList.push(childrenToken)
                        }
                        return groupList
                    },
                    []
                )

                const childPrefixes = findPrefixGroups(group, matchedPrefixes)

                recursiveCollected.push([prefix])
                if (childPrefixes.length !== 0) {
                    const combined = childPrefixes.map(
                        (childPrefix) => `${prefix}-${childPrefix}`
                    )
                    recursiveCollected.push(combined)
                }
                return recursiveCollected
            },
            []
        )

        const collectedPrefixes = Array.from(
            new Set([prefixGroups.flat()])
        ).flat()

        return collectedPrefixes
    }

    const findUniquePrefixGroups = (
        classNames: Array<string>,
        independentPrefixGroups: Array<string>
    ): Array<string> => {
        const samePrefixGroups = findPrefixGroups(independentPrefixGroups, [])

        const targetAnalysisPrefixGroups: Array<string> =
            samePrefixGroups.length === 0
                ? independentPrefixGroups
                : samePrefixGroups

        const groups = targetAnalysisPrefixGroups.map((rootPrefix) => {
            return {
                samePrefixGroups: independentPrefixGroups.filter((prefix) =>
                    prefix.startsWith(rootPrefix)
                ),
                matched: classNames.filter(
                    (className) =>
                        className.startsWith(`${rootPrefix}-`) &&
                        className !== rootPrefix
                ),
            }
        })

        const countMatching = (
            prefix: string,
            classNames: Array<string>
        ): number => {
            return classNames.reduce<number>((matched, className) => {
                if (
                    className.startsWith(`${prefix}-`) ||
                    className === prefix
                ) {
                    return matched + 1
                }
                return matched
            }, 0)
        }

        const uniqueGroupByLength: Array<string> = groups.reduce<Array<string>>(
            (finalPrefixGroups, group) => {
                const matchedGroups = group.samePrefixGroups.map(
                    (samePrefix) =>
                        [
                            samePrefix,
                            countMatching(samePrefix, group.matched),
                        ] as const
                )
                const uniqueGroups = matchedGroups.reduce<Map<number, string>>(
                    (matched, groups) => {
                        const [prefix, count] = groups
                        const prevPrefix = matched.get(count)
                        if (!prevPrefix) {
                            // new group
                            matched.set(count, prefix)
                            return matched
                        }

                        // check uniqueness by prefix length, if same count then longer prefix will be unique prefix
                        if (prefix.length > prevPrefix.length) {
                            matched.set(count, prefix)
                        }
                        return matched
                    },
                    new Map()
                )

                const uniquePrefixes = Object.values(
                    Object.fromEntries(uniqueGroups)
                )
                finalPrefixGroups.push(...uniquePrefixes)

                return finalPrefixGroups
            },
            []
        )

        const finalGroups: Array<string> = Array.from(
            new Set([
                ...independentPrefixGroups.filter((prefix) =>
                    targetAnalysisPrefixGroups.every(
                        (samePrefix) => samePrefix !== prefix
                    )
                ),
                ...uniqueGroupByLength,
            ])
        )

        return finalGroups
    }

    const prefixGroups = findUniquePrefixGroups(
        classNames,
        findPrefixGroups(classNames, [])
    )

    const soleGroups = Array.from(
        new Set(
            classNames.filter((className) => {
                return (
                    prefixGroups.some(
                        (prefix) =>
                            className.startsWith(`${prefix}-`) &&
                            className !== prefix
                    ) === false
                )
            })
        )
    )

    const valueGroups = Array.from(
        new Set(
            classNames.map((className) => {
                const valueList = prefixGroups.map((prefix) =>
                    className.replace(`${prefix}-`, "")
                )
                const shortestString = valueList.reduce(
                    (a, b) => (a!.length <= b.length ? a : b),
                    valueList[0]
                )!
                return shortestString
            })
        )
    )

    const removeAt = <ArrayT extends Array<any>>(
        arr: ArrayT,
        i: number
    ): ArrayT => {
        if (i < 0 || i >= arr.length) return arr.slice() as ArrayT
        return [...arr.slice(0, i), ...arr.slice(i + 1)] as ArrayT
    }

    // Create an array mapping each prefix to its corresponding values.
    const prefixValueMapping = prefixGroups.map((prefix, i, totPrexies) => {
        const otherPrefixes = removeAt(totPrexies, i)
        const values = Array.from(
            new Set(
                classNames
                    .filter((className) => {
                        const possible = className.startsWith(`${prefix}-`)
                        if (!possible) return false
                        const otherPossiblePrefix = otherPrefixes
                            .map((p) =>
                                className.startsWith(`${p}-`) ? p : null
                            )
                            .filter((e) => e !== null)
                        if (otherPossiblePrefix.length === 0) {
                            return true
                        }
                        const biggestLength = Math.max(
                            prefix.length,
                            ...otherPossiblePrefix.map((e) => e.length)
                        )
                        if (biggestLength === prefix.length) {
                            return true
                        }
                        return false
                    })
                    .map((className) => className.slice(prefix.length + 1))
            )
        )

        const groupHasNegative = originalClassNames.some((className) =>
            className.startsWith("-")
        )

        if (
            values.length === 0 &&
            otherPrefixes.some((other) => other.includes(prefix))
        ) {
            return {
                prefix,
                values: [],
                hasNegative: groupHasNegative,
            }
        }

        return { prefix, values, hasNegative: groupHasNegative }
    })

    // Standalone case
    const isStandAlone = prefixValueMapping.length === 0

    if (isStandAlone) {
        return {
            propertyName,
            variants: variants.length > 0 ? variants : null,
            hasNegative,
            prefixGroups,
            soleGroups,
            valueGroups: classNames,
            prefixValueMapping: classNames.map((property) => ({
                hasNegative: property.startsWith("-"),
                prefix: property,
                values: [],
            })),
            valueReferenceMap: new Map(),
        }
    }

    // Generate symbolic clusters
    const arrayIntersection = (arr1: string[], arr2: string[]): string[] =>
        arr1.filter((token) => arr2.includes(token))

    type Cluster = { commonTokens: string[]; indices: number[] }
    const clusters: Array<Cluster> = []
    for (let i = 0; i < prefixValueMapping.length; i++) {
        const current = prefixValueMapping[i]?.values

        if (!current) {
            continue
        }

        let assigned = false
        for (let cluster of clusters) {
            const common = arrayIntersection(cluster.commonTokens, current)
            if (common.length <= 5) {
                // Skip too small common things --> overhead
                continue
            }

            if (
                common.length ===
                Math.min(cluster.commonTokens.length, current.length)
            ) {
                // They are compatible; update cluster common tokens and add index.
                cluster.commonTokens = common
                cluster.indices.push(i)
                assigned = true
                break
            }
        }
        if (!assigned) {
            clusters.push({ commonTokens: current.slice(), indices: [i] })
        }
    }

    // Add symbol to clusters :: Maps cluster index -> reference symbol
    let refCounter: number = 1
    const clusterRefs = new Map<number, string>()
    clusters.forEach((cluster, idx) => {
        // if it can be extracted as variables, we should(global optimizations)
        const REFERENCE_THRESHOLD = 1 as const
        const shouldMakeReference =
            cluster.indices.length >= REFERENCE_THRESHOLD &&
            cluster.commonTokens.length > 0
        if (shouldMakeReference) {
            clusterRefs.set(idx, `$ref${refCounter}`)
            refCounter++
        }
    })
    // Create the valueReferenceMap from clusters
    const valueReferenceMap = new Map<string, string[]>()
    clusters.forEach((cluster, idx) => {
        if (clusterRefs.has(idx) && cluster.commonTokens.length > 0) {
            valueReferenceMap.set(clusterRefs.get(idx)!, cluster.commonTokens)
        }
    })

    // Update prefixValueMapping with clusters
    clusters.forEach((cluster, clusterIdx) => {
        if (!clusterRefs.has(clusterIdx)) return // no optimization if only one group in cluster

        const refSymbol = clusterRefs.get(clusterIdx)!

        cluster.indices.forEach((idx) => {
            const originalTokens = prefixValueMapping[idx]?.values
            if (originalTokens) {
                const nonSymbolicValues = originalTokens.filter(
                    (token) => !cluster.commonTokens.includes(token)
                )

                prefixValueMapping[idx]!.values =
                    nonSymbolicValues.length > 0
                        ? [refSymbol, ...nonSymbolicValues]
                        : [refSymbol]
            }
        })
    })

    return {
        propertyName,
        variants: variants.length > 0 ? variants : null,
        hasNegative,
        prefixGroups,
        soleGroups,
        valueGroups,
        prefixValueMapping,
        valueReferenceMap,
    }
}

describe("CreateOptimizableMap", () => {
    const colorSet = new Set([
        "red",
        "orange",
        "amber",
        "yellow",
        "lime",
        "green",
        "emerald",
        "teal",
        "cyan",
        "sky",
        "blue",
        "indigo",
        "violet",
        "purple",
        "fuchsia",
        "pink",
        "rose",
        "slate",
        "gray",
        "zinc",
        "neutral",
        "stone",
        "black",
        "white",
        "primary",
    ])
    const prefixRules = [
        // color like
        (prefixStr: string) => {
            if (colorSet.has(prefixStr)) return false
            return true
        },
        // number like
        (prefixStr: string) => {
            if (Number.isNaN(parseFloat(prefixStr))) return true
            return false
        },
    ]

    it("should create optimization map for <placeItems>", () => {
        const placeItemsMap = createOptimizableMap(placeItems, prefixRules)

        expect(placeItemsMap).toMatchSnapshot()
        expect(placeItemsMap.prefixGroups).toEqual(["place-items"])
    })
    it("should create optimization map for <backgroundImage>", () => {
        const backgroundImageMap = createOptimizableMap(
            backgroundImage,
            prefixRules
        )

        expect(backgroundImageMap).toMatchSnapshot()
        expect(backgroundImageMap.prefixGroups).toEqual([
            "bg-conic",
            "bg-linear",
            "bg-linear-to",
            "from",
            "to",
            "via",
            "bg",
        ])
        expect(backgroundImageMap.soleGroups).toEqual([])
    })

    it("should create optimization map for <display>", () => {
        const displayMap = createOptimizableMap(display, prefixRules)

        expect(displayMap).toMatchSnapshot()
        expect(displayMap.prefixGroups).toEqual(["inline", "table"])
        expect(displayMap.soleGroups).toEqual([
            "block",
            "contents",
            "flex",
            "flow-root",
            "grid",
            "hidden",
            "inline",
            "list-item",
            "not-sr-only",
            "sr-only",
            "table",
        ])
    })

    it("should create optimization map for <bg-blend-mode>", () => {
        const bgBlendMode = createOptimizableMap(
            backgroundBlendMode,
            prefixRules
        )

        expect(bgBlendMode).toMatchSnapshot()
        expect(bgBlendMode.prefixGroups).toEqual(["bg-blend", "bg-blend-color"])
    })

    it("should create optimization map for <bg-color>", () => {
        const bgColor = createOptimizableMap(backgroundColor, prefixRules)

        expect(bgColor).toMatchSnapshot()
        expect(bgColor.prefixGroups).toEqual(["bg"])
    })
})
