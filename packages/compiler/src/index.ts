export const compile = () => {
    console.log("Tailwindest Compiler Initialized")
}

export * from "./core/diagnostic_types"
export * from "./core/evaluator"
export * from "./core/merger"
export * from "./core/static_value"
export * from "./analyzer/dependency_graph"
export * from "./analyzer/detector"
export * from "./analyzer/lexical_gate"
export * from "./analyzer/static_resolver"
export * from "./analyzer/symbols"
export * from "./transform/import_cleanup"
export * from "./transform/replacement"
export * from "./transform/source_map"
export * from "./transform/substitutor"
export * from "./tailwind/manifest"
export * from "./tailwind/source_inline"
export * from "./vite"
