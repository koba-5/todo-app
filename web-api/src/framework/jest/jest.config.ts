import { Config } from 'jest';

const config: Config = {
  testEnvironment: 'node',
  rootDir: '../../../',
  roots: ['<rootDir>'],
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  },
};

export default config;
