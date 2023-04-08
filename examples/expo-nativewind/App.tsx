import { useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { wind, wind$ } from "tailwindest"

const container = wind({
    flex: "flex-1",
    display: "flex",
    flexDirection: "flex-col",
    gap: "gap-1",
    alignItems: "items-center",
    justifyContent: "justify-center",
    backgroundColor: "bg-teal-50",
}).class()

const button = wind$("plus", "minus")(
    {
        display: "flex",
        alignItems: "items-center",
        justifyContent: "justify-center",
        padding: "p-3",
        borderRadius: "rounded-lg",
        border: "border-transparent border-solid",
        borderWidth: "border-2",
        ":active": {
            opacity: "active:opacity-70",
        },
    },
    {
        plus: {
            backgroundColor: "bg-red-500",
            borderColor: "border-red-100",
        },
        minus: {
            backgroundColor: "bg-blue-500",
            borderColor: "border-blue-100",
        },
    }
)

export default function App() {
    const [count, setCount] = useState(0)

    return (
        <View className={container}>
            <Text className="font-bold text-2xl">Count is {count}</Text>
            <View className="flex flex-row gap-4">
                <TouchableOpacity
                    className={button.class("plus")}
                    onPress={() => setCount((c) => c + 1)}
                >
                    <Text className="text-white">Plus</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={button.class("minus")}
                    onPress={() => setCount((c) => c - 1)}
                >
                    <Text className="text-white">Minus</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
