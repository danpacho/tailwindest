import { tw } from "~/tw";

export function Box() {
    return (
        <div className={tw.style({
            display: "flex",
            alignItems: "items-center",
            justifyContent: "justify-center",
            padding: "p-4",
            margin: "m-2",
        }).class()}>
            Box
        </div>
    );
}
