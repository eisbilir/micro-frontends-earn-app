/**
 * Configure all routes for express app
 */

const _ = require("lodash");
const config = require("config");
const helper = require("./common/helper");
const errors = require("./common/errors");
const routes = require("./routes");
const authenticator = require("tc-core-library-js").middleware.jwtAuthenticator;

/**
 * Configure all routes for express app
 * @param app the express app
 */
module.exports = (app) => {
  // intercept the response body from jwtAuthenticator
  app.use(helper.interceptor);
  // Load all routes
  _.each(routes, (verbs, path) => {
    _.each(verbs, (def, verb) => {
      const controllerPath = `./controllers/${def.controller}`;
      const method = require(controllerPath)[def.method];
      if (!method) {
        throw new Error(`${def.method} is undefined`);
      }

      const actions = [];
      actions.push((req, res, next) => {
        req.signature = `${def.controller}#${def.method}`;
        next();
      });

      // add Authenticator check if route has auth
      if (def.auth) {
        actions.push((req, res, next) => {
          authenticator(_.pick(config, ["AUTH_SECRET", "VALID_ISSUERS"]))(
            req,
            res,
            next
          );
        });

        actions.push((req, res, next) => {
          if (req.authUser.isMachine) {
            // M2M
            if (
              !req.authUser.scopes ||
              !helper.checkIfExists(def.scopes, req.authUser.scopes)
            ) {
              next(
                new errors.ForbiddenError(
                  "You are not allowed to perform this action!"
                )
              );
            } else {
              req.authUser.userId = config.m2m.M2M_AUDIT_USER_ID;
              req.authUser.handle = config.m2m.M2M_AUDIT_HANDLE;
              next();
            }
          } else {
            req.authUser.jwtToken = req.headers.authorization;
            next();
          }
        });
      }

      actions.push(method);
      const fullPath = config.get("API_BASE_PATH") + path;
      app[verb](fullPath, helper.autoWrapExpress(actions));
    });
  });
  // handle api errors
  app.use(helper.errorHandler);
};
