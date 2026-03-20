module.exports = {
  apps: [
    {
      name: 'erp-api',
      script: 'src/index.ts',
      interpreter: 'none',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    }
  ]
}
