/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    preset: "ts-jest",
    rootDir: ".",
    testRegex: "test.(ts)$",
    testEnvironment: "node",
    modulePathIgnorePatterns: ["dist", "js", "website"],
    collectCoverage: true,
    coverageDirectory: "./coverage/",
    coverageReporters: ["text", "text-summary", "json", "html"],
    collectCoverageFrom: ["packages/**/*.ts", "tests/**/*.ts"],
}
