module.exports = {
    preset: "ts-jest",
    rootDir: "./",
    modulePaths: ["<rootDir>"],
    testRegex: ".+\\.(spec|test)\\.ts$",
    testTimeout: 10000,
    collectCoverageFrom: [
        "src/**",
        "!src/migrations/**",
        "!src/main.ts",
        "!src/app.module.ts",
        "!src/config/**",
        "!src/email/**",
        "test/utils/**",
    ],
    coverageDirectory: "test/coverage",
};
