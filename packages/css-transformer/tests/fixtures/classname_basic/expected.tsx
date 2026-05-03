import { tw } from "~/tw";

const boxDiv = tw.style({
    display: "flex",
    alignItems: "items-center",
    justifyContent: "justify-center",
    padding: "p-4",
    margin: "m-2",
});

export function Box() {
    return (
        <div className={boxDiv.class()}>
            Box
        </div>
    );
}
