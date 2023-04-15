const exampleEntryPoint = {
    ["expo-nativewind"]: "App.tsx",
    next: "src/app/counter.tsx",
    svelte: "src/components/theme.button.svelte",
} as const

const examplePath = "github/danpacho/tailwindest/tree/master/examples"

const StackBlitz = ({
    example,
    label,
}: {
    label: string
    example: keyof typeof exampleEntryPoint
}) => {
    return (
        <div className="flex flex-col my-6">
            <div className="p-2 rounded-tr-xl w-full border-2 border-teal-400/50 font-semibold capitalize bg-teal-300/5 text-teal-400 font-mono text-sm underline">
                {label}
            </div>
            <iframe
                src={`https://stackblitz.com/${examplePath}/${example}?embed=1&file=${exampleEntryPoint[example]}`}
                className="w-full h-screen rounded-b-lg border-2 border-t-0 border-teal-400/50"
            />
        </div>
    )
}

export { StackBlitz }
