require("dotenv").config();
module.exports = {
  GUIKIT: {
    DEBOUNCE_ON_CHANGE_TIME: 150,
  },
  API: {
    V5: "https://api.topcoder-dev.com/v5",
    V3: "https://api.topcoder-dev.com/v3",
  },
  URL: {
    BASE: "https://www.topcoder-dev.com",
    COMMUNITY_APP: "https://community-app.topcoder-dev.com",
  },
  // the server api base path
  API_BASE_PATH: process.env.API_BASE_PATH || "/api",
  // the log level, default is 'debug'
  LOG_LEVEL: process.env.LOG_LEVEL || "debug",
  // The authorization secret used during token verification.
  AUTH_SECRET: process.env.AUTH_SECRET || "mysecret",
  // The valid issuer of tokens, a json array contains valid issuer.
  VALID_ISSUERS:
    process.env.VALID_ISSUERS ||
    '["https://api.topcoder-dev.com", "https://api.topcoder.com", "https://topcoder-dev.auth0.com/", "https://auth.topcoder-dev.com/"]',
  // Auth0 URL, used to get TC M2M token
  AUTH0_URL: process.env.AUTH0_URL,
  // Auth0 audience, used to get TC M2M token
  AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE,
  // Auth0 client id, used to get TC M2M token
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  // Auth0 client secret, used to get TC M2M token
  AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
  // Proxy Auth0 URL, used to get TC M2M token
  AUTH0_PROXY_SERVER_URL: process.env.AUTH0_PROXY_SERVER_URL,
  m2m: {
    M2M_AUDIT_USER_ID:
      process.env.M2M_AUDIT_USER_ID || "00000000-0000-0000-0000-000000000000",
    M2M_AUDIT_HANDLE: process.env.M2M_AUDIT_HANDLE || "TopcoderService",
  },
};
