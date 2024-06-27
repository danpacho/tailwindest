import { tw } from "wind"

const exampleEntryPoint = {
    ["expo-nativewind"]: "App.tsx",
    next: "src/app/counter.tsx",
    svelte: "src/components/theme.button.svelte",
} as const

const examplePath = "github/danpacho/tailwindest/tree/master/examples" as const

const exampleTitle = tw.style({
    width: "w-full",
    padding: "p-2",
    backgroundColor: "bg-teal-300/5",

    borderWidth: "border-2",
    borderColor: "border-teal-400/50",
    borderTopRightRadius: "rounded-tr-xl",

    fontFamily: "font-mono",
    color: "text-teal-400",
    fontSize: "text-sm",
    fontWeight: "font-semibold",
    textTransform: "capitalize",
    textDecorationLine: "underline",
})

const StackBlitz = ({
    example,
    label,
}: {
    label: string
    example: keyof typeof exampleEntryPoint
}) => {
    return (
        <div className="flex flex-col my-6 w-full">
            <div className={exampleTitle.class}>{label}</div>
            <iframe
                src={`https://stackblitz.com/${examplePath}/${example}?embed=1&file=${exampleEntryPoint[example]}`}
                className="w-full h-screen rounded-b-lg border-2 border-t-0 border-teal-400/50"
            />
        </div>
    )
}

export { StackBlitz }
