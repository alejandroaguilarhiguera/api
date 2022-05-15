module.exports = {
  roots: ['./src'],
  testMatch: ['**/__tests__/**/*.+(ts|js)', '**/?(*.)+(spec|test).+(ts|js)'],
  notify: true,
  transform: {
    '^.+\\.(ts)$': 'ts-jest',
  },
};
