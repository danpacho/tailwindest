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

export function Mixed({ isActive }: { isActive: boolean }) {
    return (
        <div className={tw.style({
            padding: "p-4",
        }).class()}>
            <span className={tw.def([isActive && "text-white"], {
                fontSize: "text-sm",
            })}>
                Text
            </span>
        </div>
    );
}
