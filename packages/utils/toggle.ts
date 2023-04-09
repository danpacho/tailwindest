import type { NestedObject } from "../core/nested.object.type"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { wind } from "../wind"

type Toggle<StyleType extends NestedObject> = {
    /**
     * `true` condition `styleSheet`
     */
    truthy: StyleType
    /**
     * `false` condition `styleSheet`
     */
    falsy: StyleType
    /**
     * base `styleSheet`, `[ optional ]`
     */
    base?: StyleType
}

const toggle =
    <Wind extends typeof wind>(wind: Wind) =>
    (
        booleanCondition: boolean,
        { falsy, truthy, base }: Toggle<Parameters<Wind>[0]>
    ) =>
        wind(base ?? {}, {
            f: falsy,
            t: truthy,
        }).class(booleanCondition ? "t" : "f")

export { toggle }
