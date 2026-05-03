import { cva } from "class-variance-authority";
import { cn } from "lib/utils";

const btn = cva("flex", {
    variants: { intent: { primary: "bg-blue-500" } }
});

export function Mixed({ isActive }: { isActive: boolean }) {
    return (
        <div className="p-4">
            <span className={cn("text-sm", isActive && "text-white")}>
                Text
            </span>
        </div>
    );
}
