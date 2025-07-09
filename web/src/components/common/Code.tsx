import { tw } from "../../tw"
import { util } from "../utils"

const code = tw
    .style({
        fontWeight: "font-light",
        fontSize: "text-sm",
        padding: ["px-0.5", "py-0"],
        borderRadius: "rounded-sm",

        "@md": {
            padding: ["md:p-0", "md:px-0.5", "md:py-[0.25px]"],
            borderRadius: "md:rounded",
        },
    })
    .compose(util.amberColor.style())

const Code = ({ children }: React.PropsWithChildren) => (
    <code className={code.class()}>{children}</code>
)

export { Code }