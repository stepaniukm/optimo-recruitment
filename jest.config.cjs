/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
// eslint-disable-next-line no-undef
module.exports = {
	displayName: "Optimo Recruitment",
	preset: "ts-jest/presets/default-esm",
	extensionsToTreatAsEsm: [".ts"],
	globals: {
		"ts-jest": {
			tsconfig: "<rootDir>/tsconfig.json",
			useESM: true,
		},
	},
	transform: {},
	coverageDirectory: "coverage",
	testMatch: ["**/*.spec.ts", "**/*.test.ts"],
	moduleNameMapper: {
		"^(\\.{1,2}/.*)\\.js$": "$1",
	},
	clearMocks: true,
};
