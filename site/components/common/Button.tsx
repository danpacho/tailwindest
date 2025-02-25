import Link from "next/link"
import { useEffect, useState } from "react"
import { GetVariants } from "tailwindest"
import { tw } from "wind"
import { util } from "~components/utils"

const btn = tw.rotary({
    base: {
        display: "flex",
        width: "w-fit",

        borderRadius: "rounded-sm",

        paddingX: "px-1",
        paddingY: "py-1",
        fontWeight: "font-normal",

        letterSpacing: "tracking-normal",
        "@sm": {
            fontSize: "sm:text-base",
        },
        "@md": {
            paddingX: "md:px-2",
            paddingY: "md:py-1",
        },

        borderWidth: "border",
        borderColor: "border-transparent",

        ":hover": {
            opacity: "hover:opacity-75",
        },
        ":active": {
            transformTranslateY: "active:translate-y-0.5",
        },
    },
    variants: {
        fill: {
            ...util.goldGradient.style,
            borderColor: "border-amber-300",
            borderWidth: "border-[0.5px]",
            "@dark": {
                color: "dark:text-black",
            },
        },
        outline: {
            backgroundColor: "bg-transparent",

            "@dark": {
                borderColor: "dark:border-amber-100/20",
                color: "dark:text-amber-100/80",
            },
        },
    },
})

type BtnType = GetVariants<typeof btn>

const LinkButton = ({
    children,
    to,
    type = "fill",
}: React.PropsWithChildren<{
    to: string
    type?: BtnType
}>) => {
    return (
        <Link href={to} type="button" className={btn.class(type)}>
            {children}
        </Link>
    )
}

const Button = ({
    children,
    type = "fill",
    onClick,
}: React.PropsWithChildren<{
    type?: BtnType
    onClick?: React.MouseEventHandler<HTMLButtonElement>
}>) => {
    return (
        <button type="button" onClick={onClick} className={btn.class(type)}>
            {children}
        </button>
    )
}

const useClipboard = () => {
    const copyText = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
            return {
                isCopySuccess: true,
                copiedText: text,
            }
        } catch (e) {
            return {
                isCopySuccess: false,
                copiedText: text,
            }
        }
    }

    return {
        copyText,
    }
}

const CopyButton = ({
    text: copyTargetText,
    copiedText,
    defaultText,
    timeout = 4000,
}: {
    text: string
    defaultText: React.ReactNode
    copiedText: React.ReactNode
    timeout?: number
}) => {
    const [isCopied, setIsCopied] = useState(false)
    const { copyText } = useClipboard()

    useEffect(() => {
        let timer: NodeJS.Timeout
        const reset = () => setIsCopied(false)
        if (isCopied) timer = setTimeout(reset, timeout)

        return () => clearTimeout(timer)
    }, [isCopied, timeout])
    return (
        <Button
            onClick={async () => {
                const { isCopySuccess } = await copyText(copyTargetText)
                setIsCopied(isCopySuccess)
            }}
            type="outline"
        >
            {isCopied ? copiedText : defaultText}
        </Button>
    )
}

export { LinkButton, Button, CopyButton }
