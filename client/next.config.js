const dotenv = require("dotenv");

dotenv.config({ path: "../.env" });

const serverUrl = new URL(process.env.SERVER_URL).hostname;

module.exports = {
  reactStrictMode: true,
  env: {
    SERVER_URL: process.env.SERVER_URL,
  },
  images: {
    domains: [serverUrl],
  },
};
