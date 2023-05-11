const db = require("../models");
const Role = db.role;

// Recupera todos os Roles do banco de dados.
exports.findAll = (req, res) => {
    Role.findAll()
        .then(data => {
            if (data) {
                res.status(200).send(data);
            } else {
                res.status(404).send({
                    message: `Não é possível localizar todas as Roles.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocorreu algum erro ao recuperar as Roles."
            });
        });
};

// Recupera todos os Roles do banco de dados.
exports.findOne = (req, res) => {
    const id = req.params.id;

    Role.findByPk(id)
        .then(data => {
            if (data) {
                res.status(200).send(data);
            } else {
                res.status(404).send({
                    message: `Não é possível encontrar a Role com id: ${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocorreu algum erro ao recuperar a Role!"
            });
        });
};