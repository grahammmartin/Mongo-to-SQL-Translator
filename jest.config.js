module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.ts$",
  moduleFileExtensions: ["ts", "js", "json", "node"],
};
