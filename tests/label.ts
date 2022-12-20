/**
 * labeling test case
 */
const label = {
    /**
     * @param unitLabel label of testing unit
     * @returns unit label
     */
    unit: (unitLabel: string) => `[ 🆄 🅽 🅸 🆃 : ${unitLabel} ]`,
    /**
     * @param caseLabel label of testing unit case
     * @returns unit's case label
     */
    case: (caseLabel: string) => `[ 🅲 🅰 🆂 🅴 : ${caseLabel} ]`,
} as const

export { label }
