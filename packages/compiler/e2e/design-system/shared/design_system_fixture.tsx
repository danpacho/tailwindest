"use client"

import { useEffect, type ReactNode } from "react"
import { createTools } from "tailwindest"
import {
    allExpectedCandidates,
    allExpectedExcludedCandidates,
    expectedDesignSystemCases,
    expectedSectionNames,
    type DesignSystemCaseId,
} from "./design_system_expectations"
import type {
    ButtonSize,
    ButtonState,
    ButtonStatus,
    Density,
    DesignSystemTailwindest,
    FieldStatus,
} from "./design_system_types"

const tw = createTools<DesignSystemTailwindest>()

const buttonBaseStyle = {
    display: "inline-flex",
    alignItems: "items-center",
    justifyContent: "justify-center",
    gap: "gap-2",
    borderRadius: "rounded-md",
    border: "border",
    borderColor: "border-slate-300",
    backgroundColor: "bg-slate-50",
    padding: ["px-4", "py-2"],
    fontSize: "text-sm",
    fontWeight: "font-semibold",
    lineHeight: "leading-5",
    color: "text-slate-900",
    boxShadow: "shadow-sm",
    transition: "transition",
    hover: { backgroundColor: "bg-slate-100" },
    focus: { ring: "ring-2" },
    dark: {
        backgroundColor: "bg-slate-900",
        color: "text-white",
        hover: {
            backgroundColor: "bg-slate-800",
            focus: { ring: "ring-sky-300" },
        },
    },
    "data-[state=open]": {
        backgroundColor: "bg-blue-600",
        color: "text-white",
    },
}

const fieldBaseStyle = {
    display: "inline-flex",
    alignItems: "items-center",
    gap: "gap-2",
    borderRadius: "rounded-md",
    border: "border",
    borderColor: "border-slate-300",
    backgroundColor: "bg-white",
    padding: ["px-3", "py-2"],
    fontSize: "text-sm",
    color: "text-slate-900",
}

const fieldFocusStyle = {
    focus: {
        borderColor: "border-sky-500",
        ring: "ring-2",
    },
}

const composedCardBase = {
    display: "inline-flex",
    alignItems: "items-center",
    justifyContent: "justify-center",
    gap: "gap-2",
    borderRadius: "rounded-lg",
    border: "border",
    borderColor: "border-indigo-300",
    backgroundColor: "bg-indigo-50",
    padding: ["px-5", "py-3"],
    fontSize: "text-base",
    fontWeight: "font-semibold",
    color: "text-indigo-900",
}

const composedCardExtra = {
    boxShadow: "shadow-md",
    group: { hover: { borderColor: "border-cyan-500" } },
    peer: { focus: { color: "text-sky-600" } },
}

const toggleSwitch = tw.toggle({
    base: {
        display: "inline-flex",
        alignItems: "items-center",
        width: "w-12",
        height: "h-7",
        borderRadius: "rounded-full",
        border: "border",
        padding: "p-1",
        transition: "transition",
    },
    truthy: {
        borderColor: "border-emerald-500",
        backgroundColor: "bg-emerald-500",
    },
    falsy: {
        borderColor: "border-slate-300",
        backgroundColor: "bg-slate-200",
    },
})

const checkboxToggle = tw.toggle({
    base: {
        display: "inline-flex",
        alignItems: "items-center",
        justifyContent: "justify-center",
        width: "w-5",
        height: "h-5",
        borderRadius: "rounded",
        border: "border",
        borderColor: "border-slate-400",
        backgroundColor: "bg-white",
        focus: { ring: "ring-2" },
        "aria-[checked=true]": {
            backgroundColor: "bg-emerald-600",
            borderColor: "border-emerald-600",
        },
    },
    truthy: {},
    falsy: {},
})

const sizeRotary = tw.rotary({
    base: {
        display: "inline-flex",
        alignItems: "items-center",
        justifyContent: "justify-center",
        borderRadius: "rounded-md",
        border: "border",
        borderColor: "border-slate-300",
        backgroundColor: "bg-white",
        fontWeight: "font-semibold",
        color: "text-slate-900",
        transition: "transition",
    },
    variants: {
        tiny: { height: "h-7", padding: ["px-2", "py-1"], fontSize: "text-xs" },
        small: { height: "h-8", padding: ["px-3", "py-1"], fontSize: "text-sm" },
        medium: {
            height: "h-10",
            padding: ["px-4", "py-2"],
            fontSize: "text-sm",
        },
        large: { height: "h-12", padding: ["px-5", "py-3"], fontSize: "text-base" },
        giant: { height: "h-14", padding: ["px-7", "py-4"], fontSize: "text-lg" },
    },
})

const radioToneRotary = tw.rotary({
    base: {
        display: "inline-flex",
        alignItems: "items-center",
        justifyContent: "justify-center",
        width: "w-6",
        height: "h-6",
        borderRadius: "rounded-full",
        border: "border",
    },
    variants: {
        primary: {
            borderColor: "border-blue-600",
            backgroundColor: "bg-blue-50",
            color: "text-blue-900",
        },
        danger: {
            borderColor: "border-red-600",
            backgroundColor: "bg-red-50",
            color: "text-red-900",
        },
    },
})

const buttonVariants = tw.variants({
    base: {
        display: "inline-flex",
        alignItems: "items-center",
        justifyContent: "justify-center",
        gap: "gap-2",
        borderRadius: "rounded-md",
        border: "border",
        fontWeight: "font-semibold",
        transition: "transition",
    },
    variants: {
        size: {
            tiny: { height: "h-7", padding: ["px-2", "py-1"], fontSize: "text-xs" },
            small: { height: "h-8", padding: ["px-3", "py-1"], fontSize: "text-sm" },
            medium: {
                height: "h-10",
                padding: ["px-4", "py-2"],
                fontSize: "text-sm",
            },
            large: { height: "h-12", padding: ["px-5", "py-3"], fontSize: "text-base" },
            giant: { height: "h-14", padding: ["px-7", "py-4"], fontSize: "text-lg" },
        },
        status: {
            primary: {
                borderColor: "border-blue-600",
                backgroundColor: "bg-blue-500",
                color: "text-blue-50",
            },
            success: {
                borderColor: "border-emerald-600",
                backgroundColor: "bg-emerald-600",
                color: "text-emerald-50",
            },
            warning: {
                borderColor: "border-amber-600",
                backgroundColor: "bg-amber-500",
                color: "text-amber-950",
            },
            danger: {
                borderColor: "border-red-600",
                backgroundColor: "bg-red-600",
                color: "text-red-50",
            },
            info: {
                borderColor: "border-sky-600",
                backgroundColor: "bg-sky-600",
                color: "text-sky-50",
            },
            control: {
                borderColor: "border-slate-400",
                backgroundColor: "bg-white",
                color: "text-slate-900",
            },
            basic: {
                borderColor: "border-transparent",
                backgroundColor: "bg-slate-200",
                color: "text-slate-900",
            },
        },
        state: {
            default: {},
            hover: { backgroundColor: "bg-indigo-600" },
            active: { transform: "scale-95" },
            focus: { outline: "outline-2" },
            disabled: {
                opacity: "opacity-50",
                cursor: "cursor-not-allowed",
            },
        },
        shape: {
            button: {},
            buttonIcon: { width: "w-11" },
            icon: { width: "w-10", padding: "p-0" },
        },
    },
})

const fieldStatusVariants = tw.variants({
    base: {
        width: "w-full",
        borderRadius: "rounded-md",
        border: "border",
        padding: ["px-3", "py-2"],
        fontSize: "text-sm",
    },
    variants: {
        status: {
            default: {
                borderColor: "border-slate-300",
                backgroundColor: "bg-white",
                color: "text-slate-900",
            },
            primary: {
                borderColor: "border-blue-600",
                backgroundColor: "bg-blue-50",
                color: "text-blue-900",
            },
            success: {
                borderColor: "border-emerald-600",
                backgroundColor: "bg-emerald-50",
                color: "text-emerald-900",
            },
            warning: {
                borderColor: "border-amber-600",
                backgroundColor: "bg-amber-50",
                color: "text-amber-900",
            },
            danger: {
                borderColor: "border-red-600",
                backgroundColor: "bg-red-50",
                color: "text-red-900",
            },
            info: {
                borderColor: "border-sky-600",
                backgroundColor: "bg-sky-50",
                color: "text-sky-900",
            },
        },
    },
})

const cardBase = {
    borderRadius: "rounded-md",
    border: "border",
    borderColor: "border-slate-300",
    backgroundColor: "bg-white",
    padding: ["px-4", "py-3"],
    fontSize: "text-sm",
    color: "text-slate-900",
    boxShadow: "shadow-sm",
}

const cardInfo = {
    borderColor: "border-sky-600",
    backgroundColor: "bg-sky-50",
    color: "text-sky-900",
}

const cardDense = {
    padding: ["px-3", "py-2"],
}

const cardOpen = {
    borderColor: "border-violet-500",
    backgroundColor: "bg-violet-100",
    color: "text-violet-900",
}

const cardNested = {
    "data-[state=open]": { backgroundColor: "bg-violet-50" },
    "aria-[checked=true]": { borderColor: "border-violet-600" },
}

const fieldStatusStyle = fieldStatusVariants.style({ status: "success" })
const styleStyleRecord = tw.style(fieldBaseStyle).style(fieldFocusStyle)
const checkboxStyleRecord = checkboxToggle.style(true)
const radioStyleRecord = radioToneRotary.style("primary")
const mergeRecordStatic = tw.mergeRecord(cardBase, cardNested)

type NativeSyncWindow = typeof window & {
    __tailwindestDesignSystemSync?: boolean
    __tailwindestDesignSystemSyncNow?: () => void
}

function joinClassForChecked(checked: boolean) {
    if (checked) {
        return tw.join(
            "inline-flex",
            "items-center",
            "gap-2",
            "rounded-md",
            "border",
            "border-slate-300",
            "bg-white",
            "px-3",
            "py-2",
            "text-sm",
            "text-slate-800",
            "outline-2"
        )
    }
    return tw.join(
        "inline-flex",
        "items-center",
        "gap-2",
        "rounded-md",
        "border",
        "border-slate-300",
        "bg-white",
        "px-3",
        "py-2",
        "text-sm",
        "text-slate-800"
    )
}

function defClassForStatus(status: FieldStatus) {
    if (status === "danger") {
        return tw.def(["font-semibold"], fieldBaseStyle, {
            borderColor: "border-red-600",
            backgroundColor: "bg-red-50",
            color: "text-red-900",
        })
    }
    return tw.def(["font-semibold"], fieldBaseStyle)
}

function mergePropsClassFor(density: Density, status: FieldStatus) {
    if (density === "dense" && status === "info") {
        return tw.mergeProps(cardBase, cardDense, cardInfo)
    }
    if (density === "dense") {
        return tw.mergeProps(cardBase, cardDense)
    }
    if (status === "info") {
        return tw.mergeProps(cardBase, cardInfo)
    }
    return tw.mergeProps(cardBase)
}

function mergeRecordClassForOpen(open: boolean) {
    if (open) {
        return tw.mergeProps(cardBase, cardNested, cardOpen)
    }
    return tw.mergeProps(cardBase, cardNested)
}

function createDynamicMap() {
    return {
        toggle: {
            checked: toggleSwitch.class(true),
            unchecked: toggleSwitch.class(false),
        },
        toggleCompose: {
            checked: toggleSwitch
                .compose({ boxShadow: "shadow-sm", width: "w-14", height: "h-8" })
                .class(true),
            unchecked: toggleSwitch
                .compose({ boxShadow: "shadow-sm", width: "w-14", height: "h-8" })
                .class(false),
        },
        checkbox: {
            checked: checkboxToggle.class(true),
            unchecked: checkboxToggle.class(false),
        },
        radio: {
            checked: radioToneRotary.class("primary"),
            unchecked: radioToneRotary.class("danger"),
        },
        rotary: {
            tiny: sizeRotary.class("tiny"),
            small: sizeRotary.class("small"),
            medium: sizeRotary.class("medium"),
            large: sizeRotary.class("large"),
            giant: sizeRotary.class("giant"),
        } satisfies Record<ButtonSize, string>,
        rotaryCompose: {
            tiny: sizeRotary.compose({ boxShadow: "shadow-md" }).class("tiny"),
            small: sizeRotary.compose({ boxShadow: "shadow-md" }).class("small"),
            medium: sizeRotary.compose({ boxShadow: "shadow-md" }).class("medium"),
            large: sizeRotary.compose({ boxShadow: "shadow-md" }).class("large"),
            giant: sizeRotary.compose({ boxShadow: "shadow-md" }).class("giant"),
        } satisfies Record<ButtonSize, string>,
        variants: Object.fromEntries(
            (["tiny", "small", "medium", "large", "giant"] as const).flatMap(
                (size) =>
                    (
                        [
                            "primary",
                            "success",
                            "warning",
                            "danger",
                            "info",
                            "control",
                            "basic",
                        ] as const
                    ).flatMap((status) =>
                        (["default", "disabled"] as const).map((state) => [
                            `${size}:${status}:${state}`,
                            buttonVariants.class({
                                size,
                                status,
                                state,
                                shape: "button",
                            }),
                        ])
                    )
            )
        ) as Record<string, string>,
        variantsCompose: {
            checked: buttonVariants
                .compose({ boxShadow: "shadow-md" })
                .class({ size: "medium", status: "success" }),
            unchecked: buttonVariants
                .compose({ boxShadow: "shadow-md" })
                .class({ size: "medium", status: "danger" }),
        },
        fieldStatus: Object.fromEntries(
            (
                [
                    "default",
                    "primary",
                    "success",
                    "warning",
                    "danger",
                    "info",
                ] as const
            ).map((status) => [
                status,
                fieldStatusVariants.class({ status }),
            ])
        ) as Record<FieldStatus, string>,
        join: {
            checked: joinClassForChecked(true),
            unchecked: joinClassForChecked(false),
        },
        def: Object.fromEntries(
            (
                [
                    "default",
                    "primary",
                    "success",
                    "warning",
                    "danger",
                    "info",
                ] as const
            ).map((status) => [status, defClassForStatus(status)])
        ) as Record<FieldStatus, string>,
        mergeProps: {
            "comfortable:success": mergePropsClassFor("comfortable", "success"),
            "comfortable:info": mergePropsClassFor("comfortable", "info"),
            "dense:success": mergePropsClassFor("dense", "success"),
            "dense:info": mergePropsClassFor("dense", "info"),
        },
        mergeRecord: {
            open: mergeRecordClassForOpen(true),
            closed: mergeRecordClassForOpen(false),
        },
    }
}

function installDesignSystemNativeSync(map: ReturnType<typeof createDynamicMap>) {
    if (typeof window === "undefined") {
        return
    }
    const nativeWindow = window as NativeSyncWindow
    const q = (id: string) =>
        document.querySelector<HTMLElement>(`[data-testid="${id}"]`)
    const checked = () =>
        Boolean(
            document.querySelector<HTMLInputElement>(
                '[data-testid="control-checked"]'
            )?.checked
        )
    const open = () =>
        Boolean(
            document.querySelector<HTMLInputElement>(
                '[data-testid="control-open"]'
            )?.checked
        )
    const disabled = () =>
        Boolean(
            document.querySelector<HTMLInputElement>(
                '[data-testid="control-disabled"]'
            )?.checked
        )
    const value = (id: string) =>
        document.querySelector<HTMLSelectElement>(`[data-testid="${id}"]`)
            ?.value ?? ""
    const setClass = (id: string, className: string | undefined) => {
        const element = q(id)
        if (element && className) element.className = className
    }
    const setText = (id: string, text: string) => {
        const element = q(id)
        if (element) element.textContent = text
    }
    const setAttr = (id: string, name: string, attrValue: string) => {
        const element = q(id)
        if (element) element.setAttribute(name, attrValue)
    }
    const sync = () => {
        const isChecked = checked()
        const isOpen = open()
        const isDisabled = disabled()
        const size = (value("control-size") || "medium") as ButtonSize
        const status = (value("control-status") || "primary") as ButtonStatus
        const fieldStatus = (value("control-field-status") ||
            "success") as FieldStatus
        const density = (value("control-density") || "comfortable") as Density
        const state = isDisabled ? "disabled" : "default"
        setClass(
            "dynamic-toggle-preview",
            isChecked ? map.toggle.checked : map.toggle.unchecked
        )
        setClass(
            "case-toggle-compose",
            isChecked ? map.toggleCompose.checked : map.toggleCompose.unchecked
        )
        setClass(
            "case-toggle-style",
            isChecked ? map.checkbox.checked : map.checkbox.unchecked
        )
        setAttr("case-toggle-style", "aria-checked", String(isChecked))
        setClass(
            "case-rotary-style",
            isChecked ? map.radio.checked : map.radio.unchecked
        )
        setClass("dynamic-rotary-preview", map.rotary[size])
        setText("dynamic-rotary-preview", `rotary ${size}`)
        setClass("case-rotary-compose", map.rotaryCompose[size])
        setClass(
            "dynamic-variants-preview",
            map.variants[`${size}:${status}:${state}`]
        )
        const variants = q("dynamic-variants-preview") as
            | HTMLButtonElement
            | undefined
        if (variants) variants.disabled = isDisabled
        setText("dynamic-variants-preview", `${status} ${size}`)
        setClass(
            "case-variants-compose",
            isChecked
                ? map.variantsCompose.checked
                : map.variantsCompose.unchecked
        )
        setClass("dynamic-field-status", map.fieldStatus[fieldStatus])
        setAttr("dynamic-field-status", "placeholder", `${fieldStatus} status`)
        setClass("case-join", isChecked ? map.join.checked : map.join.unchecked)
        setClass("case-def", map.def[fieldStatus])
        setText("case-def", `def ${fieldStatus}`)
        const mergePropsKey =
            `${density}:${fieldStatus === "info" ? "info" : "success"}` as const
        setClass("case-merge-props", map.mergeProps[mergePropsKey])
        setText("case-merge-props", `mergeProps ${density} ${fieldStatus}`)
        setClass(
            "case-merge-record",
            isOpen ? map.mergeRecord.open : map.mergeRecord.closed
        )
        setAttr("case-merge-record", "data-state", isOpen ? "open" : "closed")
        setAttr("case-merge-record", "aria-checked", String(isOpen))
        setText("case-merge-record", `mergeRecord ${isOpen ? "open" : "closed"}`)
        setAttr("case-style-class", "data-state", isOpen ? "open" : "closed")
    }
    const scheduleSync = () => {
        queueMicrotask(sync)
        requestAnimationFrame(sync)
        setTimeout(sync, 0)
    }

    nativeWindow.__tailwindestDesignSystemSyncNow = sync
    if (!nativeWindow.__tailwindestDesignSystemSync) {
        nativeWindow.__tailwindestDesignSystemSync = true
        const controlIds = new Set([
            "control-checked",
            "control-open",
            "control-disabled",
            "control-size",
            "control-status",
            "control-field-status",
            "control-density",
        ])
        const toggleIds = new Set([
            "dynamic-toggle-preview",
            "case-toggle-style",
            "case-rotary-style",
            "case-toggle-compose",
        ])
        document.addEventListener(
            "change",
            (event) => {
                const element = (event.target as Element | null)?.closest?.(
                    "[data-testid]"
                )
                if (element && controlIds.has(element.getAttribute("data-testid") ?? "")) {
                    scheduleSync()
                }
            },
            true
        )
        document.addEventListener(
            "click",
            (event) => {
                const element = (event.target as Element | null)?.closest?.(
                    "[data-testid]"
                )
                if (!element) return
                const id = element.getAttribute("data-testid") ?? ""
                if (toggleIds.has(id)) {
                    const control = document.querySelector<HTMLInputElement>(
                        '[data-testid="control-checked"]'
                    )
                    if (control) control.checked = !control.checked
                    scheduleSync()
                    return
                }
                if (controlIds.has(id)) {
                    scheduleSync()
                }
            },
            true
        )
    }
    sync()
}

export function DesignSystemFixture() {
    const dynamicMap = createDynamicMap()
    const styleClass = tw.style(buttonBaseStyle).class()
    const styleComposeClass = tw
        .style(composedCardBase)
        .compose(composedCardExtra)
        .class()
    const toggleClass = toggleSwitch.class(false)
    const toggleComposeClass = toggleSwitch
        .compose({ boxShadow: "shadow-sm", width: "w-14", height: "h-8" })
        .class(false)
    const checkboxClass = checkboxToggle.class(false)
    const rotaryClass = sizeRotary.class("medium")
    const rotaryComposeClass = sizeRotary
        .compose({ boxShadow: "shadow-md" })
        .class("medium")
    const radioClass = radioToneRotary.class("danger")
    const variantsClass = buttonVariants.class({
        size: "medium",
        status: "primary",
        state: "default",
        shape: "button",
    })
    const variantsComposeClass = buttonVariants
        .compose({ boxShadow: "shadow-md" })
        .class({ size: "medium", status: "danger" })
    const fieldVariantsClass = fieldStatusVariants.class({ status: "success" })
    const joinClass = joinClassForChecked(false)
    const defClass = defClassForStatus("success")
    const mergePropsClass = mergePropsClassFor("comfortable", "success")
    const mergeRecordClass = mergeRecordClassForOpen(false)

    return (
        <main
            data-testid="design-system-root"
            className="min-h-screen bg-slate-200 p-4 text-slate-950 md:p-6"
        >
            <div className="mx-auto grid max-w-7xl gap-4">
                <header className="grid gap-3 border-b border-slate-300 pb-4">
                    <h1 className="text-xl font-semibold">
                        Tailwindest Design System E2E
                    </h1>
                    <div className="flex flex-wrap gap-2">
                        <SelectControl
                            testId="control-size"
                            label="Size"
                            value="medium"
                            values={["tiny", "small", "medium", "large", "giant"]}
                        />
                        <SelectControl
                            testId="control-status"
                            label="Status"
                            value="primary"
                            values={[
                                "primary",
                                "success",
                                "warning",
                                "danger",
                                "info",
                                "control",
                                "basic",
                            ]}
                        />
                        <SelectControl
                            testId="control-field-status"
                            label="Field"
                            value="success"
                            values={[
                                "default",
                                "primary",
                                "success",
                                "warning",
                                "danger",
                                "info",
                            ]}
                        />
                        <SelectControl
                            testId="control-density"
                            label="Density"
                            value="comfortable"
                            values={["comfortable", "dense"]}
                        />
                        <label className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">
                            <input
                                data-testid="control-checked"
                                type="checkbox"
                                defaultChecked={false}
                            />
                            checked
                        </label>
                        <label className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">
                            <input
                                data-testid="control-open"
                                type="checkbox"
                                defaultChecked={false}
                            />
                            open
                        </label>
                        <label className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">
                            <input
                                data-testid="control-disabled"
                                type="checkbox"
                                defaultChecked={false}
                            />
                            disabled
                        </label>
                    </div>
                </header>

                <Section title="Button">
                    <CaseButton
                        caseId="button.style.class"
                        testId="case-style-class"
                        className={styleClass}
                        dataState="closed"
                    >
                        style.class
                    </CaseButton>
                    <CaseButton
                        caseId="button.rotary.class"
                        testId="dynamic-rotary-preview"
                        className={rotaryClass}
                    >
                        rotary medium
                    </CaseButton>
                    <CaseButton
                        caseId="button.variants.class"
                        testId="dynamic-variants-preview"
                        className={variantsClass}
                        disabled={false}
                    >
                        primary medium
                    </CaseButton>
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
                        {(["tiny", "small", "medium", "large", "giant"] as const).map(
                            (item) => (
                                <CaseButton
                                    key={item}
                                    caseId="button.rotary.class"
                                    testId={`matrix-rotary-${item}`}
                                    className={sizeRotary.class(item)}
                                >
                                    {item}
                                </CaseButton>
                            )
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-7">
                        {(
                            [
                                "primary",
                                "success",
                                "warning",
                                "danger",
                                "info",
                                "control",
                                "basic",
                            ] as const
                        ).map((item) => (
                            <CaseButton
                                key={item}
                                caseId="button.variants.class"
                                testId={`matrix-variants-medium-${item}-default`}
                                className={buttonVariants.class({
                                    size: "medium",
                                    status: item,
                                    state: "default",
                                    shape: "button",
                                })}
                            >
                                {item}
                            </CaseButton>
                        ))}
                    </div>
                    <CaseButton
                        caseId="button.variants.class"
                        testId="matrix-button-medium-primary-default"
                        className={buttonVariants.class({
                            size: "medium",
                            status: "primary",
                            state: "default",
                            shape: "button",
                        })}
                    >
                        matrix match
                    </CaseButton>
                </Section>

                <Section title="Form Elements">
                    <input
                        {...caseAttrs(
                            "form.style.style",
                            "case-style-style",
                            tw.mergeProps(fieldBaseStyle, fieldFocusStyle)
                        )}
                        className={tw.mergeProps(fieldBaseStyle, fieldFocusStyle)}
                        placeholder="style.style input"
                    />
                    <pre
                        data-testid="case-style-style-json"
                        className="overflow-auto rounded-md border border-slate-300 bg-white p-2 text-xs"
                    >
                        {JSON.stringify(styleStyleRecord)}
                    </pre>
                    <input
                        {...caseAttrs(
                            "form.variants.style",
                            "dynamic-field-status",
                            fieldVariantsClass
                        )}
                        className={fieldVariantsClass}
                        placeholder="success status"
                    />
                    <label
                        {...caseAttrs("form.join", "case-join", joinClass)}
                        className={joinClass}
                    >
                        <input type="checkbox" checked={false} readOnly />
                        join
                    </label>
                    <div
                        {...caseAttrs("form.def", "case-def", defClass)}
                        className={defClass}
                    >
                        def success
                    </div>
                    <textarea
                        className={tw.def(["min-h-20"], fieldBaseStyle)}
                        placeholder="textarea"
                    />
                    <select className={tw.mergeProps(fieldBaseStyle)}>
                        <option>Select</option>
                    </select>
                </Section>

                <Section title="Checkbox">
                    <button
                        {...caseAttrs(
                            "checkbox.toggle.style",
                            "case-toggle-style",
                            checkboxClass
                        )}
                        aria-checked={false}
                        className={checkboxClass}
                        type="button"
                    >
                    </button>
                    <pre className="overflow-auto rounded-md border border-slate-300 bg-white p-2 text-xs">
                        {JSON.stringify(checkboxStyleRecord)}
                    </pre>
                </Section>

                <Section title="Radio Button">
                    <button
                        {...caseAttrs(
                            "radio.rotary.style",
                            "case-rotary-style",
                            radioClass
                        )}
                        className={radioClass}
                        type="button"
                    >
                        •
                    </button>
                    <pre className="overflow-auto rounded-md border border-slate-300 bg-white p-2 text-xs">
                        {JSON.stringify(radioStyleRecord)}
                    </pre>
                </Section>

                <Section title="Toggle">
                    <button
                        {...caseAttrs(
                            "toggle.toggle.class",
                            "dynamic-toggle-preview",
                            toggleClass
                        )}
                        className={toggleClass}
                        type="button"
                    >
                        <span className="block h-5 w-5 rounded-full bg-white shadow-sm" />
                    </button>
                    <button
                        {...caseAttrs(
                            "toggle.toggle.compose",
                            "case-toggle-compose",
                            toggleComposeClass
                        )}
                        className={toggleComposeClass}
                        type="button"
                    >
                        <span className="block h-5 w-5 rounded-full bg-white shadow-sm" />
                    </button>
                </Section>

                <Section title="Composite Cards">
                    <div className="group grid gap-2">
                        <input
                            data-testid="peer-focus-control"
                            className="peer rounded-md border border-slate-300 px-3 py-2"
                            placeholder="peer focus"
                        />
                        <div
                            {...caseAttrs(
                                "card.style.compose",
                                "case-style-compose",
                                styleComposeClass
                            )}
                            className={styleComposeClass}
                        >
                            style.compose
                        </div>
                    </div>
                    <div
                        {...caseAttrs(
                            "card.rotary.compose",
                            "case-rotary-compose",
                            rotaryComposeClass
                        )}
                        className={rotaryComposeClass}
                    >
                        rotary.compose
                    </div>
                    <div
                        {...caseAttrs(
                            "card.variants.compose",
                            "case-variants-compose",
                            variantsComposeClass
                        )}
                        className={variantsComposeClass}
                    >
                        variants.compose
                    </div>
                    <div
                        {...caseAttrs(
                            "card.mergeProps",
                            "case-merge-props",
                            mergePropsClass
                        )}
                        className={mergePropsClass}
                    >
                        mergeProps comfortable success
                    </div>
                    <div
                        {...caseAttrs(
                            "card.mergeRecord",
                            "case-merge-record",
                            mergeRecordClass
                        )}
                        className={mergeRecordClass}
                        data-state="closed"
                        aria-checked={false}
                    >
                        mergeRecord closed
                    </div>
                    <pre className="overflow-auto rounded-md border border-slate-300 bg-white p-2 text-xs">
                        {JSON.stringify(mergeRecordStatic)}
                    </pre>
                </Section>

                <Section title="Debug Matrix">
                    <div
                        data-testid="debug-manifest-summary"
                        className="grid gap-2 text-xs md:grid-cols-2"
                    >
                        <DebugList title="Expected candidates" values={allExpectedCandidates} />
                        <DebugList
                            title="Expected exclusions"
                            values={allExpectedExcludedCandidates}
                        />
                    </div>
                    <div
                        data-testid="section-checklist"
                        className="grid grid-cols-2 gap-2 text-xs md:grid-cols-4"
                    >
                        {expectedSectionNames.map((name) => (
                            <span
                                key={name}
                                className="rounded border border-slate-300 bg-white px-2 py-1"
                            >
                                {name}
                            </span>
                        ))}
                    </div>
                </Section>
                <DynamicControlsScript map={dynamicMap} />
            </div>
        </main>
    )
}

function DynamicControlsScript({ map }: Readonly<{ map: ReturnType<typeof createDynamicMap> }>) {
    useEffect(() => {
        installDesignSystemNativeSync(map)
    }, [map])
    return null
}

function Section({
    children,
    title,
}: Readonly<{ children: ReactNode; title: string }>) {
    return (
        <section
            data-testid={`section-${title.toLowerCase().replaceAll(" ", "-")}`}
            className="grid gap-3 border-b border-slate-300 pb-4"
        >
            <h2 className="text-base font-semibold">{title}</h2>
            <div className="grid gap-3 md:grid-cols-3">{children}</div>
        </section>
    )
}

function CaseButton({
    caseId,
    children,
    className,
    dataState,
    disabled,
    testId,
}: Readonly<{
    caseId: DesignSystemCaseId
    children: ReactNode
    className: string
    dataState?: string
    disabled?: boolean
    testId: string
}>) {
    return (
        <button
            {...caseAttrs(caseId, testId, className)}
            className={className}
            data-state={dataState}
            disabled={disabled}
            type="button"
        >
            {children}
        </button>
    )
}

function SelectControl({
    label,
    testId,
    value,
    values,
}: Readonly<{
    label: string
    testId: string
    value: string
    values: readonly string[]
}>) {
    return (
        <label className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">
            {label}
            <select data-testid={testId} defaultValue={value}>
                {values.map((item) => (
                    <option key={item} value={item}>
                        {item}
                    </option>
                ))}
            </select>
        </label>
    )
}

function DebugList({
    title,
    values,
}: Readonly<{ title: string; values: readonly string[] }>) {
    return (
        <div className="rounded-md border border-slate-300 bg-white p-3">
            <h3 className="mb-2 font-semibold">{title}</h3>
            <ul className="grid gap-1">
                {values.map((value) => (
                    <li key={value} className="font-mono">
                        {value}
                    </li>
                ))}
            </ul>
        </div>
    )
}

function caseAttrs(
    caseId: DesignSystemCaseId,
    testId: string,
    expectedClass?: string
) {
    const item = expectedDesignSystemCases[caseId]
    return {
        "data-testid": testId,
        "data-api": item.api,
        "data-case": caseId,
        "data-expected-class": expectedClass ?? item.staticClass ?? "",
        "data-expected-token-group": item.tokenGroup,
    }
}
