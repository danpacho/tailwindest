import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { DesignSystemFixture } from "../../design-system/shared/design_system_fixture"
import "./style.css"

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <DesignSystemFixture />
    </StrictMode>
)
