import { CubeIcon } from "@heroicons/react/24/outline"
import {
    createContext,
    forwardRef,
    useEffect,
    useMemo,
    useRef,
    useState,
    useContext,
    useCallback,
    type PropsWithChildren,
} from "react"
import { tw } from "wind"
import { util } from "~components/utils"

type PointerLeaveState = boolean
type PointerLeaveSetter = (isPointerLeaved: boolean) => void
const PointerLeaveValueContext = createContext<PointerLeaveState>(true)
const PointerLeaveSetterContext = createContext<PointerLeaveSetter>(() => {})

function PointerLeaveProvider({ children }: PropsWithChildren) {
    const [isPointerLeaved, setIsPointerLeaved] =
        useState<PointerLeaveState>(true)
    const cachedAction = useCallback((isPointerLeaved: PointerLeaveState) => {
        setIsPointerLeaved(isPointerLeaved)
    }, [])

    return (
        <PointerLeaveSetterContext.Provider value={cachedAction}>
            <PointerLeaveValueContext.Provider value={isPointerLeaved}>
                {children}
            </PointerLeaveValueContext.Provider>
        </PointerLeaveSetterContext.Provider>
    )
}

const usePointerLeaveState = () => {
    const isPointerLeave = useContext(PointerLeaveValueContext)
    return { isPointerLeave }
}

const usePointerLeaveSetter = () => {
    const setIsPointerLeave = useContext(PointerLeaveSetterContext)
    return { setIsPointerLeave }
}

const usePointerLeaveContext = () => {
    const { isPointerLeave } = usePointerLeaveState()
    const { setIsPointerLeave } = usePointerLeaveSetter()
    return {
        isPointerLeave,
        setIsPointerLeave,
    }
}

const usePointerEvent = (): {
    onPointerEnter: React.DOMAttributes<HTMLElement>["onPointerEnter"]
    onPointerLeave: React.DOMAttributes<HTMLElement>["onPointerLeave"]
} => {
    const { setIsPointerLeave } = usePointerLeaveSetter()
    return {
        onPointerEnter: () => {
            setIsPointerLeave(false)
        },
        onPointerLeave: () => {
            setIsPointerLeave(true)
        },
    }
}

type Coord = { top: number; left: number; height: number }
type CoordMap = Map<string, Coord>

/**
 * @description Make auto-completion hint of target code block
 * @returns
 */
const Container = ({
    suggestions,
    children,
    targetClassName = "highlighted",
    tooltipDisplayTime = 500,
}: React.PropsWithChildren<{
    suggestions: Map<string, React.ReactNode>
    targetClassName?: string
    tooltipDisplayTime?: number
}>) => {
    const codeRef = useRef<HTMLDivElement>(null)
    const codeSuggestionRef = useRef<HTMLDivElement>(null)
    const targetNodes = useRef<HTMLPreElement[]>()
    const codeCompletionCoords = useRef<CoordMap>()

    const { isPointerLeave, setIsPointerLeave } = usePointerLeaveContext()
    const [suggestionBlockTop, setSuggestionBlockTop] = useState(0)
    const [highlightedBlock, setHighlightedBlock] = useState("")
    const [isHintActive, setIsHintActive] = useState(false)

    const { height, left, top } = useMemo(() => {
        const defaultCoord: Coord = {
            top: 0,
            height: 0,
            left: 0,
        }
        if (!highlightedBlock) return defaultCoord

        return (
            codeCompletionCoords.current?.get(highlightedBlock) ?? defaultCoord
        )
    }, [highlightedBlock])

    useEffect(() => {
        const suggestionHeight = codeSuggestionRef.current?.offsetHeight
        if (suggestionHeight)
            setSuggestionBlockTop(top - suggestionHeight - height / 4)
    }, [highlightedBlock])

    useEffect(() => {
        const timerId: NodeJS.Timeout = setTimeout(() => {
            if (isPointerLeave) setIsHintActive(false)
        }, tooltipDisplayTime)

        return () => clearTimeout(timerId)
    }, [isPointerLeave])

    useEffect(() => {
        const pointerHandler = {
            onEnter: (blockName: string) => {
                setHighlightedBlock(blockName)
                setIsHintActive(true)
                setIsPointerLeave(false)
            },
            onLeave: () => {
                setIsPointerLeave(true)
            },
        }

        if (codeRef.current) {
            targetNodes.current = [
                ...codeRef.current.querySelectorAll<HTMLPreElement>(
                    `.${targetClassName}`
                ),
            ]

            if (targetNodes.current?.length === 0)
                throw Error(`There is no node target for ${targetClassName}`)

            targetNodes.current?.forEach((target) => {
                // node accessor label
                target.classList.add(target.innerText.trim())

                target.addEventListener("pointerenter", (e) => {
                    const targetNodeClassNames = (
                        e.target as HTMLPreElement
                    ).className
                        .split(" ")
                        .filter((className) => className !== "highlighted")

                    pointerHandler.onEnter(targetNodeClassNames[0])
                })
                target.addEventListener("pointerleave", pointerHandler.onLeave)
            })
            const coord: CoordMap = new Map()
            targetNodes.current?.forEach(
                ({
                    innerText: nodeAccessor,
                    offsetTop,
                    offsetLeft,
                    offsetHeight,
                }) => {
                    coord.set(nodeAccessor, {
                        top: offsetTop,
                        left: offsetLeft,
                        height: offsetHeight,
                    })
                }
            )
            codeCompletionCoords.current = coord
        }

        return () => {
            targetNodes.current?.forEach((target) => {
                target.removeEventListener("pointerenter", (e) => {
                    pointerHandler.onEnter(
                        (e.target as HTMLPreElement).innerHTML
                    )
                })
                target.removeEventListener(
                    "pointerleave",
                    pointerHandler.onLeave
                )
            })
        }
    }, [])

    return (
        <div ref={codeRef} className="relative my-4">
            {children}
            <Suggestion
                ref={codeSuggestionRef}
                left={left}
                top={suggestionBlockTop}
                isActive={isHintActive}
            >
                {suggestions.get(highlightedBlock)}
            </Suggestion>
        </div>
    )
}

const codeSuggestion = tw
    .toggle({
        base: {
            display: "hidden",
            "@sm": {
                display: "sm:flex",
            },
            position: "absolute",
            zIndex: "z-10",

            fontFamily: "font-mono",
            borderRadius: "rounded-sm",

            backdropBlur: "backdrop-blur-md",

            maxHeight: "max-h-72",
            padding: "p-1.5",

            boxShadow: "shadow-2xl",
            overflow: "overflow-y-auto",

            transition: "transition ease-out",
            transformGPU: "transform-gpu",
            fontSize: "text-sm",
        },
        truthy: {
            opacity: "opacity-100",
        },
        falsy: {
            opacity: "opacity-0",
            pointerEvents: "pointer-events-none",
        },
    })
    .compose(util.amberColor.style())

const Suggestion = forwardRef<
    HTMLDivElement,
    React.PropsWithChildren<{
        top: number
        left: number
        isActive: boolean
    }>
>(({ left, top, isActive, children }, ref) => {
    return (
        <div
            {...usePointerEvent()}
            ref={ref}
            className={codeSuggestion.class(isActive)}
            style={{
                top: top,
                left: left,
            }}
        >
            {children}
        </div>
    )
})

const Auto = ({
    autos,
    originalName,
}: {
    autos: string[]
    originalName?: string
}) => {
    const { setIsPointerLeave } = usePointerLeaveSetter()

    const autoTarget = useRef<HTMLPreElement>()
    useEffect(() => {
        if (!originalName) return

        const targetBlocks = document.getElementsByClassName(originalName)[0]
        if (targetBlocks === null)
            throw Error(`There is no target for className ${originalName}.`)
        autoTarget.current = targetBlocks as HTMLPreElement
    }, [originalName])

    return (
        <div
            className="flex flex-col items-center justify-start gap-1 w-full z-0"
            onPointerEnter={() => setIsPointerLeave(false)}
        >
            {autos.map((auto) => (
                <button
                    key={auto}
                    type="button"
                    onClick={() => {
                        if (autoTarget.current === undefined) return
                        autoTarget.current.innerText = auto
                    }}
                    onPointerEnter={() => setIsPointerLeave(false)}
                    aria-label={`suggestion, ${auto}`}
                    className="flex flex-row items-center justify-start gap-2 px-1 w-full rounded hover:bg-amber-100/10 border border-transparent hover:border-amber-100/10 cursor-pointer active:translate-y-[1px]"
                >
                    <CubeIcon className="min-w-3 min-h-3 w-3 h-3" />
                    <div className="text-amber-200 text-left max-w-xs">
                        {auto}
                    </div>
                </button>
            ))}
        </div>
    )
}

const Property = ({
    type,
    description,
    href,
    linkName,
    paramName,
    paramDescription,
}: {
    type?: React.ReactNode
    description?: React.ReactNode
    linkName?: string
    href?: string
    paramDescription?: string
    paramName?: string
}) => {
    const isLinkActivated = href && linkName
    const isParamActivated = paramDescription && paramName
    return (
        <div>
            {type && (
                <>
                    (property) <span className="text-amber-200">{type}</span>
                    <br />
                </>
            )}
            {description && (
                <>
                    @description —{" "}
                    <span className="text-amber-200">{description}</span>
                    <br />
                </>
            )}
            {isLinkActivated && (
                <>
                    @see —{" "}
                    <a
                        className="text-amber-400 underline hover:opacity-75"
                        href={href}
                    >
                        {linkName}
                    </a>
                    <br />
                </>
            )}
            {isParamActivated && (
                <>
                    @param{" "}
                    <span className="text-amber-200">
                        {paramName}— {paramDescription}
                    </span>
                    <br />
                </>
            )}
        </div>
    )
}

const Hint = () => <></>
Hint.Property = Property
Hint.Auto = Auto

const CodeCompletion = () => <></>
CodeCompletion.Container = Container
CodeCompletion.Hint = Hint

export { CodeCompletion, PointerLeaveProvider }
