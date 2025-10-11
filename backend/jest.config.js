const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {

  testEnvironment: "node",
  testMatch: ['**/__tests__/**/*.ts?(x)','**/?(*.)+(spec|test).ts?(x)'], // Padrão para localizar arquivos de teste
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  transform: {
    ...tsJestTransformCfg,
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
};