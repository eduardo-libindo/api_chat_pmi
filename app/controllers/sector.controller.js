const db = require("../models");
const Sector = db.sector;

// Retrieve all Sector from the database.
exports.findAll = (req, res) => {
    Sector.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocorreu algum erro ao recuperar setores!"
            });
        });
};