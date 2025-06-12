module.exports = {
  globalSetup: '<rootDir>/FinFam/jest.setup.js',
  globalTeardown: '<rootDir>/FinFam/jest.teardown.js',
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ["<rootDir>/FinFam/dist/"],
  transform: {
    "\\.tsx?$": "ts-jest"
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  roots: ["<rootDir>/server"],
  testMatch: ["**/tests/**/*.ts?(x)"]
};
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ["<rootDir>/FinFam/dist/"],
  transform: {
    "\\.tsx?$": "ts-jest"
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  roots: ["<rootDir>/server"],
  testMatch: ["**/tests/**/*.ts?(x)"],
  globalSetup: '<rootDir>/jest.setup.js',
  globalTeardown: '<rootDir>/jest.teardown.js'
};