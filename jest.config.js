import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

const config = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
};

/** @type {import("jest").Config} **/
export default config;
