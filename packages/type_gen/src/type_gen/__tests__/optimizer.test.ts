import { describe, expect, it } from "vitest"
import { collected } from "./__mocks__/collection"

function createOptimizableMap(
    collected: {
        propertyName: string
        classNames: Array<string>
        variants: Array<string>
    },
    prefixRules: Array<(someText: string) => boolean> = []
): {
    propertyName: string
    hasNegative: boolean
    prefixGroups: Array<string>
    valueGroups: Array<string>
    variants: Array<string> | null
    prefixValueMapping: Array<{
        prefix: string
        values: Array<string>
        hasNegative: boolean
    }>
    valueReferenceMap: Map<string, Array<string>>
} {
    const { propertyName, classNames: originalClassNames, variants } = collected

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

                        if (splitted.length === 1) return null

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

    const prefixGroups = findPrefixGroups(classNames, [])

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

    function removeAt<ArrayT extends Array<any>>(
        arr: ArrayT,
        i: number
    ): ArrayT {
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
        values

        const groupHasNegative = originalClassNames.some((className) =>
            className.startsWith("-")
        )
        return { prefix, values, hasNegative: groupHasNegative }
    })

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
    const clusterRefs = new Map<typeof refCounter, string>()
    clusters.forEach((cluster, idx) => {
        if (cluster.indices.length >= 2) {
            clusterRefs.set(idx, `$ref${refCounter}`)
            refCounter++
        }
    })

    // Create the valueReferenceMap from clusters
    const valueReferenceMap = new Map<string, string[]>()
    clusters.forEach((cluster, idx) => {
        if (clusterRefs.has(idx)) {
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
        valueGroups,
        prefixValueMapping,
        valueReferenceMap,
    }
}

describe("Optimizer", () => {
    it("should create optimization map", () => {
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
        const optimizationMap = createOptimizableMap(collected, [
            // color like
            (prefixStr) => {
                if (colorSet.has(prefixStr)) return false
                return true
            },
            // number like
            (prefixStr) => {
                if (Number.isNaN(parseFloat(prefixStr))) return true
                return false
            },
        ])

        expect(optimizationMap).toMatchSnapshot()
    })
})
