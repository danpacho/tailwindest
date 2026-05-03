import { cva } from "class-variance-authority";

const btn = cva("flex items-center", {
    variants: {
        intent: {
            primary: "bg-blue-500 text-white",
            secondary: "bg-gray-500"
        }
    },
    defaultVariants: {
        intent: "primary"
    },
    compoundVariants: [
        { intent: "primary", class: "p-4" }
    ]
});
