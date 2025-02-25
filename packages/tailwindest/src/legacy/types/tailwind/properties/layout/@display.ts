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
     *@description Utilities for controlling the display box type of an element.
     *@see {@link https://tailwindcss.com/docs/display display}
     */
    display: TailwindDisplay
}
