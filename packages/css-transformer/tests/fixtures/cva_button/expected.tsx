import { tw } from "~/tw";

const btn = /**
 * @defaultVariants {
        intent: "primary"
    }
 * @compoundVariants [
 *         { intent: "primary", class: "p-4" }
 *     ]
 */
tw.variants({
    base: {
        display: "flex",
        alignItems: "items-center",
    },
    variants: {
        intent: {
            primary: {
                backgroundColor: "bg-blue-500",
                color: "text-white",
            },
            secondary: {
                backgroundColor: "bg-gray-500",
            },
        },
    },
});
