/* eslint-disable */
export default {
  displayName: 'operations-service',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  moduleNameMapper: {
    "^uuid$": "<rootDir>../../node_modules/uuid/dist/index.js",
    '^@applib/share-server-common/(.*)$': '<rootDir>../../libs/share-server-common/src/$1',
  },
  coverageDirectory: '../../coverage/apps/oprations-service',
};
