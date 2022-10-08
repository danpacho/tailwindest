import { logger } from "./logger.js"

/** @typedef {(...arg: any[]) => any} Func*/
/** @typedef {{label: string, iterTime: number, iteration: number}} BenchResult*/

class Bench {
    /** @type {Bench | null}*/
    static #instance = null

    /** @type {BenchResult[]} */
    #benchResult = []

    constructor() {
        if (Bench.#instance === null) {
            Bench.#instance = this
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
     * @param {number} [iteration = 100000] number of iteration
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
     * itrate bench function
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
        logger.header("Bench Total Results!").log("\n")
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
        return Bench.#instance ?? this
    }
}

const bench = new Bench().getInstance()

export { bench }
