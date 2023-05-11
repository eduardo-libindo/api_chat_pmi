const { verifySignUp } = require("../middleware");
const user = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  // Create a new User
  app.post("/api/users", [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted], user.create);

  // Retrieve all Users
  app.get("/api/users", user.findAll);

  // Retrieve all actives Users
  app.get("/api/users/actives", user.findAllActives);

  // Retrieve all onlines Users
  app.get("/api/users/onlines", user.findAllOnlines);

  // Retrieve User in username
  app.get("/api/users/search", user.findByUsername);

  // Retrieve a single User with id
  app.get("/api/users/:id", user.findOne);

  // Update a User with id
  app.put("/api/users/:id", [verifySignUp.checkRolesExisted], user.update);

  // Delete a User with id
  app.delete("/api/users/:id", user.delete);

  // Delete all Users
  app.delete("/api/users", user.deleteAll);

};