import { tw } from "~/tw";

export function Component({ isActive, className }: { isActive: boolean, className?: string }) {
    return (
        <div className={tw.def([isActive && "bg-blue-500", className], {
            display: "flex",
            alignItems: "items-center",
            padding: "p-4",
        })}>
            Content
        </div>
    );
}
