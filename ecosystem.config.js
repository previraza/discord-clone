module.exports = {
  apps: [
    {
      name: 'Mcisme - Echo',
      script: 'start',
      watch: '.next/build',
      env: {
        NODE_ENV: 'production',
        PORT: 2080,
      },
    },
    {
      script: './sw/',
      watch: ['./sw'],
    },
  ],

  deploy: {
    production: {
      user: 'SSH_USERNAME',
      host: 'SSH_HOSTMACHINE',
      ref: 'origin/master',
      repo: 'GIT_REPOSITORY',
      path: 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy':
        'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
    },
  },
}
