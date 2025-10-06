module.exports = {
  apps: [
    {
      name: 'aromia-web',
      script: '/var/www/html/aromia/aromia_web/dist/aromia_app/server/server.mjs',
      interpreter: 'node',
      interpreter_args: '--enable-source-maps',
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      }
    }
  ]
};
