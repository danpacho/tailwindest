/* eslint-disable no-console */
import chalk from "chalk"

/**
 * @log log manager
 */
class Logger {
    /**@type {Logger | null} */
    static #instance = null

    #dividerString =
        "\n————————————————————————————————————————————————————————————————————————————————————\n"
    constructor() {
        if (Logger.#instance === null) {
            Logger.#instance = this
        }
    }

    /**
     * @log log
     * @param {string | number} message
     */
    log(message) {
        console.log(message)
        return this
    }

    /**
     * @log bold message
     * @param {string | number} message
     */
    bold(message) {
        this.log(chalk.bold(message))
        return this
    }
    /**
     * @log clear all logs
     */
    clear() {
        console.clear()
        return this
    }
    /**
     * @log divider `----`
     */
    divider() {
        this.log(`${chalk.whiteBright(this.#dividerString)}`)
        return this
    }
    /**
     * @log header message
     * @param {string} message
     * @param {"success" | "error"} [type="success"]
     */
    header(message, type = "success") {
        if (type === "success") {
            this.log(chalk.greenBright.black.bold(message))
        } else {
            this.log(chalk.redBright.black.bold(message))
        }
        return this
    }
    /**
     * @log calculated data
     * @type {(arg:{label: string, data: any}) => this}
     * */
    data({ label, data }) {
        this.log("\n").header(label).log("\n")
        console.dir(data, { depth: null })
        return this
    }

    /**
     * @log iteration time
     * @type {(arg:{label: string, iteration: number, iterTime: number}) => this}
     */
    iterTime({ label, iteration, iterTime }) {
        this.log(
            `${chalk.white(
                `Bench - ${chalk.bold(label)} ${chalk.bold.green(
                    `${chalk.underline(iteration.toLocaleString())} iteration`
                )}`
            )}: ${chalk.bgYellowBright.bold.black(
                ` ${iterTime.toLocaleString()}ms `
            )}`
        )
        return this
    }
    getLogger() {
        return Logger.#instance ?? this
    }
}

const logger = new Logger().getLogger()

export { logger }
