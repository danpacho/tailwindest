import type { NestedObject } from "../core/nested.object.type"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { wind } from "../wind"

type Toggle<StyleType extends NestedObject> = {
    truthy: StyleType
    falsy: StyleType
    base?: StyleType
}

const toggle =
    <Wind extends typeof wind>(wind: Wind) =>
    (
        condition: boolean,
        { falsy, truthy, base }: Toggle<Parameters<Wind>[0]>
    ) =>
        wind(base ?? {}, {
            f: falsy,
            t: truthy,
        }).class(condition ? "t" : "f")

export { toggle }
