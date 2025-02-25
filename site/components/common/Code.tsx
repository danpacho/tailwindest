import { tw } from "wind"
import { util } from "~components/utils"

const code = tw
    .style({
        fontWeight: "font-light",
        fontSize: "text-sm",
        paddingX: "px-0.5",
        paddingY: "py-0",
        borderRadius: "rounded-sm",

        "@md": {
            padding: "md:p-0",
            paddingX: "md:px-0.5",
            paddingY: "md:py-[0.25px]",
            borderRadius: "md:rounded",
        },
    })
    .compose(util.amberColor.style())

const Code = ({ children }: React.PropsWithChildren) => (
    <code className={code.class()}>{children}</code>
)

export { Code }
