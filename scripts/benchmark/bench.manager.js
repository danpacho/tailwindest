import { cpus, release, type } from "node:os"
import { logger } from "./logger.js"
/** @typedef {(...arg: any[]) => any} Func*/
/** @typedef {{label: string, iterTime: number, iteration: number}} BenchResult*/

export class BenchManager {
    /** @type {BenchResult[]} */
    #benchResult = []

    constructor() {
        return
    }
    /**
     * start bench
     */
    start() {
        logger.clear().divider().header("Boot iteration bench 🚀").divider()
        return this
    }
    /**
     * iteration bench
     * @param {string} label header of testing
     * @param {Func} func iteration callback
     * @param {number} [iteration = 100000] optional, number of iteration, default `100,000`
     * @param {boolean=} displayData optional, activated by default
     */
    bench(label, func, iteration = 100000, displayData = false) {
        logger.header(`Bench start`)
        const { iterTime } = this.#iterate(func, iteration)
        const benchResult = {
            label,
            iterTime,
            iteration,
        }
        this.#setBenchResult(benchResult)
        logger.iterTime(benchResult)

        if (displayData) {
            const data = func()
            logger
                .data({
                    label: `Data Result: ${label}`,
                    data,
                })
                .divider()
        }
        return this
    }

    /**
     * iterate bench function
     * @param {Func} func
     * @param {number} [iteration = 100000]
     */
    #iterate(func, iteration = 10000) {
        const start = performance.now()
        for (let i = 0; i < iteration; i++) {
            func(i)
        }
        const end = performance.now()
        const iterTime = end - start
        return {
            iterTime,
        }
    }

    /**
     * @param {BenchResult} result
     */
    #setBenchResult(result) {
        this.#benchResult.push(result)
    }

    /**
     * print total bench results
     */
    getTotalBenchResult() {
        const currentCpuInfo = cpus()
        const { model } = currentCpuInfo[0]
        logger
            .divider()
            .header("Bench total result")
            .log("")
            .bold(`📦 OS: ${type()}, @${release()}`)
            .bold(`📦 MACHINE: ${model}`)
            .log("")

        if (this.#benchResult.length === 0) {
            logger.header("No Bench, Please Add Bench ⛔️", "error").divider()
        } else {
            this.#benchResult.forEach(({ iterTime, label, iteration }) => {
                logger.iterTime({
                    iteration,
                    iterTime,
                    label,
                })
            })
            logger.divider()
        }
    }
}
