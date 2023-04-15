import { cpus, release, type } from "node:os"
import { logger } from "./logger.js"
/** @typedef {(...arg: any[]) => any} Func*/
/** @typedef {{label: string, iterTime: number, iteration: number}} BenchResult*/

class BenchManager {
    /** @type {BenchManager | null}*/
    static #instance = null

    /** @type {BenchResult[]} */
    #benchResult = []

    constructor() {
        if (BenchManager.#instance === null) {
            BenchManager.#instance = this
        }
    }
    /**
     * start bench
     */
    start() {
        logger.clear().divider().header("Boot Iteration Bench 🚀").divider()
        return this
    }
    /**
     * iteration bench
     * @param {string} label header of testing
     * @param {Func} func iteration callback
     * @param {number} [iteration = 100000] optional, number of iteration, default `100,000`
     * @param {boolean=} displayData optional, activated by default
     */
    bench(label, func, iteration = 100000, displayData = true) {
        logger.header("Bench Started!").log("\n")

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
        } else {
            logger.divider()
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
            func()
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
            .header("Bench Total Results!")
            .log("")
            .bold(` 📦 OS: ${type()}, @${release()} `)
            .bold(` 📦 MACHINE: ${model} `)
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

    /**
     * get bench singleton instance
     */
    getInstance() {
        return BenchManager.#instance ?? this
    }
}

const benchManager = new BenchManager().getInstance()

export { benchManager }
