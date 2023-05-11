const db = require("../models");
const Room = db.room;
const Sector = db.sector;

const Op = db.Sequelize.Op;

// Cria e salva uma nova sala
exports.create = async (req, res) => {

    try {
        const { name, sector, isActive } = req.body;
        if (!name || !sector) {
            return res.status(400).send({
                message: "Por favor insira todos os campos!"
            });
        }

        const room = await Room.create({
            name: name,
            sector: sector,
            isActive: isActive ? isActive : false
        });

        if (req.body.sector !== null) {
            const sectorRow = await Sector.findByPk(req.body.sector);
            if (sectorRow) {
                const result = await room.addRoomSector(sectorRow, { through: "room_sectors" });
                if (result)
                    return res.json({
                        type: "success",
                        message: "Sala registrada com sucesso!"
                    });
            } else {
                res.status(401).json({ message: "Tipo de setor não existe!" });
            }
        } else {
            res.status(401).json({ message: "Não foi possivel registrar o setor da sala!" });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Recupera todas as Salas do banco de dados.
exports.findAll = (req, res) => {
    Room.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocorreu um erro ao recuperar as salas."
            });
        });
};

// encontra o nome da sala
exports.findByName = (req, res) => {

    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

    Room.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocorreu algum erro ao recuperar o nome."
            });
        });
}

// encontra todas as Salas Ativas
exports.findAllActives = (req, res) => {
    Room.findAll({ where: { isActive: true } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocorreu um erro ao recuperar as salas."
            });
        });
};

// Encontra uma única Sala com um id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Room.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Não é possível encontrar a sala com id: ${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Erro ao recuperar Sala com id: " + id
            });
        });
};

// Atualiza uma sala pelo id na requisição
exports.update = async (req, res) => {
    try {
        const id = req.params.id;

        const room = await Room.findByPk(id);

        if (req.body.sector !== null) {

            if (req.body.sector === room.sector) {
                const sectorRow = await Sector.findByPk(room.sector);
                const result = await room.addRoomSector(sectorRow, { through: "user_roles" });

                if (result) {
                    console.log("Sala registrada na assosicação com sucesso!")
                } else {
                    console.log("Sala não registrada na assosicação com sucesso!")
                }
            } else {
                const sectorRowDestroy = await Sector.findByPk(room.sector);
                await room.removeRoomSector(sectorRowDestroy);

                const sectorRow = await Sector.findByPk(req.body.sector);
                const result = await room.addRoomSector(sectorRow, { through: "user_roles" });

                if (result) {
                    console.log("Sala registrada na assosicação com sucesso!")
                } else {
                    console.log("Sala não registrada na assosicação com sucesso!")
                }
            }

        } else {
            const sectorRow = await Sector.findByPk(room.sector);
            const result = await room.addRoomSector(sectorRow, { through: "user_roles" });

            if (result) {
                console.log("Sala registrada na assosicação com sucesso!")
            } else {
                console.log("Sala não registrada na assosicação com sucesso!")
            }
        }

        Room.update({
            name: req.body.name ? req.body.name : room.name,
            sector: req.body.sector ? req.body.sector : room.sector,
            isActive: req.body.isActive ? req.body.isActive : room.isActive,
        }, { where: { id: id } })
            .then(result => {
                if (result == 1) {
                    res.send({ message: "A sala foi atualizada com sucesso!" });
                } else {
                    res.send({
                        message: `Não é possível atualizar a sala com id: ${id}. Talvez a sala não tenha sido encontrada!`
                    });
                }
            })

    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
};

// Excluir uma sala com o id especificado na solicitação
exports.delete = (req, res) => {
    const id = req.params.id;

    Room.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "A sala foi deletada com sucesso!"
                });
            } else {
                res.send({
                    message: `Não é possível excluir a sala com id: ${id}. Talvez a sala não tenha sido encontrada!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Não foi possível deletar a sala com id: " + id
            });
        });
};

// Exclui todas as salas do banco de dados.
exports.deleteAll = (req, res) => {
    Room.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} salas foram excluídas com sucesso!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocorreu um erro ao remover todas as salas."
            });
        });
};