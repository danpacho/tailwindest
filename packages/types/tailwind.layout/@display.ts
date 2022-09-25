type TailwindDisplay =
    | "block"
    | "inline-block"
    | "inline"
    | "flex"
    | "inline-flex"
    | "table"
    | "inline-table"
    | "table-caption"
    | "table-cell"
    | "table-column"
    | "table-column-group"
    | "table-footer-group"
    | "table-header-group"
    | "table-row-group"
    | "table-row"
    | "flow-root"
    | "grid"
    | "inline-grid"
    | "contents"
    | "list-item"
    | "hidden"

export type TailwindDisplayType = {
    /**
     *@note Utilities for controlling the display box type of an element.
     *@docs [display](https://tailwindcss.com/docs/display)
     */
    display: TailwindDisplay
}
