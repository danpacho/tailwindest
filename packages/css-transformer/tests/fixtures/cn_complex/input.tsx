import { cn } from "lib/utils";

export function Component({ isActive, className }: { isActive: boolean, className?: string }) {
    return (
        <div className={cn("flex items-center p-4", isActive && "bg-blue-500", className)}>
            Content
        </div>
    );
}
