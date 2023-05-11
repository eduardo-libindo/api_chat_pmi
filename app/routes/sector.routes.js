const sector = require("../controllers/sector.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        next();
    });

    // Retrieve all sectores
    app.get("/api/sectores", sector.findAll);

};