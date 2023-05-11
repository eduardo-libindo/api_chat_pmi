const { authJwt, verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post("/api/auth/signup", [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted], controller.signup);

  app.post("/api/auth/signin", controller.signin);

  app.post("/api/auth/signout", controller.signout);

  app.post("/api/auth/refresh_token", controller.refresh_token);

  app.get("/api/auth/protected", authJwt.protected, authJwt.protectedRoute);

  //////////////////////////////////////////////////////////////////////////////////////


  // app.get("/api/access/authorization/:token", [authJwt.isAuthorization]);

  // app.get("/api/access/user", [authJwt.verifyToken], authJwt.protectedRoteUser);

  // app.get("/api/access/mod", [authJwt.verifyToken], authJwt.protectedRoteModerator);

  // app.get("/api/access/admin", [authJwt.verifyToken], authJwt.protectedRoteAdmin);

};
