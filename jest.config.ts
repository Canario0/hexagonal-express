import type { Config } from "@jest/types";

// Sync object
const config: Config.InitialOptions = {
  preset: "ts-jest/",
  testEnvironment: "node",
  clearMocks: true,
  coverageProvider: "v8",
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },
  testMatch: ["**/?(*.)+(test).[t|j]s?(x)"],
  moduleDirectories: ["node_modules", "<rootDir>/src"],
};
export default config;
