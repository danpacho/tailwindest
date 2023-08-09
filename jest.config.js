/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    preset: "ts-jest",
    rootDir: ".",
    testRegex: "test.(ts)$",
    testEnvironment: "node",
    collectCoverage: true,
    coverageDirectory: "./coverage/",
    collectCoverageFrom: ["packages/**/*.ts"],
    modulePathIgnorePatterns: ["node_modules", "site"],
    coverageReporters: ["text", "text-summary", "json", "html"],
}
