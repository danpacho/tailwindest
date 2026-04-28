import { createFileRoute } from "@tanstack/react-router"
import { DesignSystemFixture } from "../../../design-system/shared/design_system_fixture"

export const Route = createFileRoute("/")({
    component: DesignSystemFixture,
})
