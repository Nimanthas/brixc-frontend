// This will load our .env file and add the values to process.env,
// IMPORTANT: Omit this line if you don't want to use this functionality
require("dotenv").config({ silent: true });

module.exports = {
  port: process.env.PORT || 8280, //prod port
  env: process.env.NODE_ENV || "production",
  pg_user: process.env.DB_USER || "postgres",
  pg_pw: process.env.DB_PASSWORD || "P@ssw0rd",
  pg_host: process.env.DB_HOST || "localhost",
  pg_port: process.env.DB_PORT || "5432",
  pg_db: process.env.DB_DATABASE || "brixc",
  mongodb_uri: process.env.MONGODB_URI || "brixc.s9tdfui.mongodb.net",
  mongodb_user: process.env.MONGODB_USER || "brixc",
  mongodb_password: process.env.MONGODB_PASSWORD || "oN29exMyWnAhSjBm",
  mongodb_name: process.env.MONGODB_NAME || "brixc",
  api_token_expireing_tolerance: 5,
  zoom_base_url: "https://api.zoom.us/v2",
  integration_username: "brixcapi",
  integration_password: "brixcapi",
  token_refresh_timeout: process.env.TOKEN_REFRESH_TIMEOUT || '3d',
  token_access_timeout: process.env.TOKEN_ACCESS_TIMEOUT || '60m',
  token_issuer: process.env.TOKEN_ISSUER || 'brixc-digital-automation'
};