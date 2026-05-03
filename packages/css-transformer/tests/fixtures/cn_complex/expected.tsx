import { tw } from "~/tw";

const componentDiv = tw.style({
    display: "flex",
    alignItems: "items-center",
    padding: "p-4",
});

export function Component({ isActive, className }: { isActive: boolean, className?: string }) {
    return (
        <div className={componentDiv.class(isActive && "bg-blue-500", className)}>
            Content
        </div>
    );
}
