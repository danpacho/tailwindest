import boxen, { Options } from "boxen"
import c from "chalk"

export interface LoggerConstructor {
    name: string
    spaceSize?: number
    tabSize?: number
    useDate?: boolean
    quite?: boolean
}
interface LogOption {
    enter?: boolean
    depth?: number
    prefix?: "base" | "full" | "none"
}

/* eslint-disable no-console */
export class Logger {
    public constructor(options: LoggerConstructor | undefined = undefined) {
        if (options) {
            const { spaceSize, tabSize, name, quite } = options
            this._tabSize = tabSize ?? 4
            this._spaceSize = spaceSize ?? 1
            this.quite = quite ?? false
            this.name = name
            this._useDate = options.useDate ?? false
        }
    }
    private name: string = "Logger"
    private _useDate: boolean = false
    public quite: boolean = false
    private _tabSize: number = 4
    private _spaceSize: number = 1
    private join(...stringVector: string[]): string {
        return stringVector.join(this.spaceStr)
    }
    private $c: typeof c = c
    public get c(): typeof c {
        return this.$c
    }
    private $log(messages: string[], enter: boolean = false) {
        if (this.quite) return
        console.log(
            enter ? this.enter(this.join(...messages)) : this.join(...messages)
        )
    }

    public log(
        message: string,
        options: LogOption = {
            enter: false,
            depth: 0,
            prefix: "base",
        }
    ) {
        const { enter, depth } = options
        const depthStr =
            depth && depth > 0 ? `${this.tabStr.repeat(depth)}` : ""
        const logMessage =
            options.prefix === "full" ? `${this.name}: ${message}` : message
        this.$log(
            options.prefix === "none"
                ? [logMessage]
                : [depthStr, this.c.gray("›"), logMessage],
            enter
        )
    }

    public updateName(name: string) {
        this.name = name
    }
    public box(message: string, options?: Options) {
        this.$log([boxen(message, options)])
    }
    public info(message: string) {
        if (this.quite) return

        console.info(
            this.join(
                this.c.bgBlueBright.bold.black(` INFO `),
                this.c.blue(this.name),
                message
            )
        )
    }
    public warn(message: string) {
        if (this.quite) return

        console.warn(
            this.join(
                this.c.bgYellow.bold.black(` WARN `),
                this.c.yellow(this.name),
                message
            )
        )
    }
    public error(message: string) {
        if (this.quite) return

        console.error(
            this.join(
                this.c.bgRed.bold.black(` ERROR `),
                this.c.red(this.name),
                message
            )
        )
    }
    public success(message: string) {
        if (this.quite) return

        console.log(
            this.join(
                this.c.bgGreen.bold.black(` SUCCESS `),
                this.c.green(this.name),
                message
            )
        )
    }
    public tab(message?: string) {
        this.$log([this.tabStr, message ?? ""])
    }
    public enter(message: string) {
        return `${message}\n`
    }
    public get tabStr(): string {
        return " ".repeat(this._tabSize)
    }
    public get spaceStr(): string {
        return " ".repeat(this._spaceSize)
    }
}
