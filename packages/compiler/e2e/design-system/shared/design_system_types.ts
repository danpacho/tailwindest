import type { CreateCompiledTailwindest } from "tailwindest"

type DesignTailwind = {
    alignItems: string
    backgroundColor: string
    border: string
    borderColor: string
    borderRadius: string
    boxShadow: string
    color: string
    cursor: string
    display: string
    fontSize: string
    fontWeight: string
    gap: string
    height: string
    justifyContent: string
    lineHeight: string
    margin: string
    opacity: string
    outline: string
    padding: string
    ring: string
    textAlign: string
    transform: string
    transition: string
    width: string
}

type DesignNestGroups =
    | "active"
    | "aria-[checked=true]"
    | "dark"
    | "data-[invalid=true]"
    | "data-[state=open]"
    | "disabled"
    | "focus"
    | "group"
    | "hover"
    | "md"
    | "peer"
    | "sm"

export type DesignSystemStyle = CreateCompiledTailwindest<{
    tailwind: DesignTailwind
    tailwindNestGroups: DesignNestGroups
    useArbitrary: false
    useArbitraryVariant: true
}>

export type DesignSystemTailwindest = {
    tailwindest: DesignSystemStyle
    tailwindLiteral: string
    useArbitrary: false
    useTypedClassLiteral: true
}

export type ButtonSize = "tiny" | "small" | "medium" | "large" | "giant"

export type ButtonStatus =
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "control"
    | "basic"

export type ButtonState = "default" | "hover" | "active" | "focus" | "disabled"

export type ButtonShape = "button" | "buttonIcon" | "icon"

export type FieldStatus =
    | "default"
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "info"

export type Density = "comfortable" | "dense"
