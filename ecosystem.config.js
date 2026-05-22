module.exports = {
  apps: [
    {
      name: 'Mcisme - Echo',
      script: 'npm run start',
      watch: '.next/build',
      env: {
        NODE_ENV: 'production',
        PORT: 2080,
      },
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
