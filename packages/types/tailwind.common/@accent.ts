import { TailwindArbitrary } from "./@arbitrary"

type TailwindColorOpacity =
    | "5"
    | "10"
    | "15"
    | "20"
    | "25"
    | "30"
    | "35"
    | "40"
    | "45"
    | "50"
    | "55"
    | "60"
    | "65"
    | "70"
    | "75"
    | "80"
    | "85"
    | "90"
    | "95"

export type TailwindColorAccent =
    | "50"
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900"

export type TailwindColorAccentWithOpacity =
    | `${TailwindColorAccent}/${TailwindColorOpacity}`
    | TailwindArbitrary
