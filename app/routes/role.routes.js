const role = require("../controllers/role.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        next();
    });

    // Retrieve all roles
    app.get("/api/roles", role.findAll);

    // Retrieve single Role with id
    app.get("/api/roles/:id", role.findOne);

};