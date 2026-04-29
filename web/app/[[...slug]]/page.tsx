import { getMDXComponents } from "@/components/mdx"
import { CollapseSidebarOnLoad } from "@/components/collapse-sidebar-on-load"
import { baseOptions } from "@/lib/layout.shared"
import { source } from "@/lib/source"
import { DocsLayout } from "fumadocs-ui/layouts/docs"
import {
    DocsBody,
    DocsDescription,
    DocsPage,
    DocsTitle,
} from "fumadocs-ui/layouts/docs/page"
import { createRelativeLink } from "fumadocs-ui/mdx"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

type PageProps = {
    params: Promise<{
        slug?: string[]
    }>
}

export function generateStaticParams() {
    return source.generateParams()
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { slug = [] } = await params
    const page = source.getPage(slug)

    if (!page) return {}

    return {
        title: page.data.title,
        description: page.data.description,
    }
}

export default async function Page({ params }: PageProps) {
    const { slug = [] } = await params
    const page = source.getPage(slug)

    if (!page) notFound()

    const MDX = page.data.body
    const isHome = slug.length === 0
    const components = getMDXComponents({
        a: createRelativeLink(source, page),
    })

    return (
        <DocsLayout {...baseOptions()} tree={source.getPageTree()}>
            <CollapseSidebarOnLoad />
            <DocsPage toc={page.data.toc} footer={{ className: "tw-page-footer" }}>
                {!isHome ? <DocsTitle>{page.data.title}</DocsTitle> : null}
                {!isHome ? (
                    <DocsDescription>{page.data.description}</DocsDescription>
                ) : null}
                <DocsBody>
                    <MDX components={components as never} />
                </DocsBody>
            </DocsPage>
        </DocsLayout>
    )
}
