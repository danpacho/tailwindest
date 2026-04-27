import { tw } from "~/tw";

const btn = tw.variants({
    base: {
        display: "flex",
    },
    variants: {
        intent: {
            primary: {
                backgroundColor: "bg-blue-500",
            },
        },
    },
});

const mixedSpan = tw.style({
    fontSize: "text-sm",
});

const mixedDiv = tw.style({
    padding: "p-4",
});

export function Mixed({ isActive }: { isActive: boolean }) {
    return (
        <div className={mixedDiv.class()}>
            <span className={mixedSpan.class(isActive && "text-white")}>
                Text
            </span>
        </div>
    );
}
