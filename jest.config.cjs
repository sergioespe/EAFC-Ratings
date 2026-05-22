/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    // Stub CSS imports
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Stub image/file imports
    '\\.(jpg|jpeg|png|gif|svg|webp)$': '<rootDir>/src/__mocks__/fileMock.cjs',
    // Stub the big JSON data file
    'listadoJugadores\\.json$': '<rootDir>/src/__mocks__/listadoJugadores.cjs',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
};
