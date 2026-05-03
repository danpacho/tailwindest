import defaultMdxComponents from "fumadocs-ui/mdx"
import * as TabsComponents from "fumadocs-ui/components/tabs"
import type { MDXComponents } from "mdx/types"
import type { ComponentPropsWithoutRef, ReactNode } from "react"

type CardProps = ComponentPropsWithoutRef<"a"> & {
    title?: ReactNode
}

type CalloutProps = ComponentPropsWithoutRef<"div"> & {
    title?: ReactNode
    type?: string
}

function joinClassName(...values: Array<string | undefined>) {
    return values.filter(Boolean).join(" ")
}

function Cards({
    className,
    ...props
}: ComponentPropsWithoutRef<"div">) {
    return <div className={joinClassName("tw-card-grid", className)} {...props} />
}

function Card({ title, children, className, href, ...props }: CardProps) {
    const content = (
        <>
            {title ? <span className="tw-card-title">{title}</span> : null}
            <div className="tw-card-body">{children}</div>
        </>
    )

    if (href) {
        return (
            <a
                className={joinClassName("tw-card", className)}
                href={href}
                {...props}
            >
                {content}
            </a>
        )
    }

    return <div className={joinClassName("tw-card", className)}>{content}</div>
}

function Callout({
    title,
    children,
    className,
    type = "note",
    ...props
}: CalloutProps) {
    return (
        <div
            className={joinClassName("tw-callout", className)}
            data-type={type}
            {...props}
        >
            {title ? <div className="tw-callout-title">{title}</div> : null}
            <div>{children}</div>
        </div>
    )
}

export function getMDXComponents(components?: MDXComponents) {
    const mdxComponents = {
        ...defaultMdxComponents,
        ...TabsComponents,
        Card,
        Cards,
        Callout,
        ...components,
    }

    return mdxComponents as unknown as MDXComponents
}

export const useMDXComponents = getMDXComponents

declare global {
    type MDXProvidedComponents = ReturnType<typeof getMDXComponents>
}
