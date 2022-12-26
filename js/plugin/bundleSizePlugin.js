import maxmin from "maxmin"
import { logger } from "../benchmark/logger.js"

/**@return {import('rollup').Plugin} bundle size plugin */
function bundleSizePlugin() {
    return {
        name: "bundle-size",
        generateBundle(_, bundle) {
            const [dev, prod] = Object.keys(bundle)

            const bundledDev = bundle[dev]
            const bundledProd = bundle[prod]

            if ("code" in bundledProd && "code" in bundledDev) {
                const size = maxmin(bundledDev.code, bundledProd.code, true)
                logger
                    .log("")
                    .header("   Check Bundle Size   ")
                    .log("")
                    .bold(size)
                    .log("")
            } else {
                logger
                    .log("")
                    .header(`Can't find ${dev} / ${prod} code ‼️`)
                    .log("")
            }
        },
    }
}

export { bundleSizePlugin }
