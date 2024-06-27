import { tw } from "@/constants/tw"
import { useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"

const container = tw.style({
    flex: "flex-1",
    display: "flex",
    flexDirection: "flex-col",
    gap: "gap-1",
    alignItems: "items-center",
    justifyContent: "justify-center",
    backgroundColor: "bg-teal-50",
}).class

const button = tw.rotary({
    base: {
        display: "flex",
        alignItems: "items-center",
        justifyContent: "justify-center",
        padding: "p-3",
        borderRadius: "rounded-2xl",
        borderColor: "border-transparent",
        borderWidth: "border-4",
        transition: "transition ease-in",
        transitionDuration: "duration-300",
        ":active": {
            opacity: "active:opacity-70",
            transformScale: "active:scale-105",
        },
        ":hover": {},
    },
    plus: {
        backgroundColor: "bg-red-500",
        borderColor: "border-red-100",
    },
    minus: {
        backgroundColor: "bg-blue-500",
        borderColor: "border-blue-100",
    },
})

export default function Index() {
    const [count, setCount] = useState(0)

    return (
        <View className={container}>
            <Text className="font-bold text-red text-2xl">
                Count is {count}
            </Text>
            <View className="flex flex-row gap-4">
                <TouchableOpacity
                    className={button.class("minus")}
                    onPress={() => setCount((c) => c - 1)}
                >
                    <Text className="text-white">Minus</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={button.class("plus")}
                    onPress={() => setCount((c) => c + 1)}
                >
                    <Text className="text-white">Plus</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
