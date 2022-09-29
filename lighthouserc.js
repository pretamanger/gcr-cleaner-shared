module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run build && npm run start',
      url: ['http://localhost:3000'],
      numberOfRuns: 1,
      startServerReadyTimeout: 60000,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.3 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'filesystem',
    },
  },
}
