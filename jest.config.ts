import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/lib/security/sanitize.ts',
    'src/lib/language.ts',
    'src/lib/progress.ts',
    'src/lib/quiz.ts',
    'src/app/api/chat/route.ts',
    'src/app/quiz/page.tsx',
    'src/app/checklist/page.tsx',
  ],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70,
    },
  },
  coverageReporters: ['html', 'text', 'text-summary'],
};

export default createJestConfig(config);
