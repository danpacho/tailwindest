import { PlugBase, Pluggable } from "../plugin"

type TailwindOpacity<Plug extends PlugBase = ""> =
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
    | Pluggable<Plug>

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

export type TailwindColorWithOpacity<Plug extends PlugBase = ""> =
    `${string}/${TailwindOpacity<Plug>}`
