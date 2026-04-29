"use client"

import { useSidebar } from "fumadocs-ui/layouts/docs/slots/sidebar"
import { useEffect, useRef } from "react"

export function CollapseSidebarOnLoad() {
    const { setCollapsed, setOpen } = useSidebar()
    const didCollapse = useRef(false)

    useEffect(() => {
        if (didCollapse.current) return

        didCollapse.current = true
        setCollapsed(true)
        setOpen(false)
    }, [setCollapsed, setOpen])

    return null
}
