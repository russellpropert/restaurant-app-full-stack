module.exports = ({ env }) => ({
  host: env('STRAPI_ACCEPT_CONNECTIONS_FROM_HOST', '0.0.0.0'),
  port: env.int('STRAPI_LISTEN_ON_PORT', 1337),
  admin: {
    auth: {
      secret: env('STRAPI_ADMIN_JWT_SECRET', ''),
    },
  },
});
