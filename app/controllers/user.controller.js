const db = require("../models");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

const bcrypt = require("bcryptjs");

exports.create = async (req, res) => {

    try {
        const { firstName, secondName, username, email, password, role, isActive } = req.body;
        if (!firstName || !secondName || !username || !email || !password || !role) {
            return res.status(400).json({
                message: "Por favor insira todos os campos!"
            });
        }

        const user = await User.create({
            firstName: firstName,
            secondName: secondName,
            username: username,
            email: email,
            password: bcrypt.hashSync(password, 8),
            role: role,
            isActive: isActive ? isActive : false,
            isOnline: false,
        });

        if (role !== null) {
            const roleRow = await Role.findByPk(role);
            if (roleRow) {
                const result = await user.addUserRole(roleRow, { through: "user_roles" })
                if (result)
                    return res.status(200).json({
                        type: "success",
                        message: "Usuário registrado com sucesso!"
                    });
            } else {
                res.status(401).json({ message: "Tipo de Função não existe!" });
            }
        } else {
            res.status(401).json({ message: "Não foi possivel registrar usuário!" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.findAll = (req, res) => {
    User.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocorreu algum erro ao recuperar usuários!"
            });
        });
}

exports.findByUsername = (req, res) => {

    const username = req.query.username;
    var condition = username ? { username: { [Op.like]: `%${username}%` } } : null;

    User.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocorreu algum erro ao recuperar o nome do usuário!"
            });
        });
}

exports.findAllActives = (req, res) => {
    User.findAll({ where: { isActive: true } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocorreu algum erro ao recuperar usuários ativos!"
            });
        });
}

exports.findAllOnlines = (req, res) => {
    User.findAll({ where: { isOnline: true } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocorreu algum erro ao recuperar usuários online!"
            });
        });
}

exports.findOne = (req, res) => {
    const id = req.params.id;

    User.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Não é possível encontrar o usuário com o id: ${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Erro ao recuperar usuário com id: " + id
            });
        });
}

exports.update = async (req, res) => {
    const id = req.params.id;

    const user = await User.findByPk(id);

    const isValid = bcrypt.compareSync(req.body.password, user.password);

    function isSenha() {
        console.log(isValid)
        if (req.body.password == user.password || isValid == true) {
            return user.password;
        } else {
            return bcrypt.hashSync(req.body.password, 8);
        }
    }

    data = {
        firstName: req.body.firstName ? req.body.firstName : user.firstName,
        secondName: req.body.secondName ? req.body.secondName : user.secondName,
        username: req.body.username ? req.body.username : user.username,
        email: req.body.email ? req.body.email : user.email,
        password: isSenha(),
        role: req.body.role ? req.body.role : user.role,
        isActive: req.body.isActive ? req.body.isActive : user.isActive,
        isOnline: user.isOnline,
        refreshToken: user.refreshToken
    }

    if (req.body.role !== null) {

        if (req.body.role === user.role) {
            const roleRow = await Role.findByPk(req.body.role)
            const result = await user.addUserRole(roleRow, { through: "user_roles" })

            if (result) {
                console.log("Usuario registrada na assosicação com sucesso!")
            } else {
                console.log("Usuario não registrada na assosicação com sucesso!")
            }
        } else {
            const roleRowDestroy = await Role.findByPk(user.role);
            await user.removeUserRole(roleRowDestroy);

            const roleRow = await Role.findByPk(req.body.role)
            const result = await user.addUserRole(roleRow, { through: "user_roles" })

            if (result) {
                console.log("Usuario registrada na assosicação com sucesso!")
            } else {
                console.log("Usuario não registrada na assosicação com sucesso!")
            }
        }

    } else {
        const roleRow = await Role.findByPk(req.body.role)
        const result = await user.addUserRole(roleRow, { through: "user_roles" })

        if (result) {
            console.log("Usuario registrada na assosicação com sucesso!")
        } else {
            console.log("Usuario não registrada na assosicação com sucesso!")
        }
    }

    User.update(data, {
        where: { id: id }
    }).then(num => {
        if (num == 1) {
            res.send({
                message: "O usuário foi atualizado com sucesso."
            });
        } else {
            res.send({
                message: `Não é possível atualizar o usuário com id: ${id}. Talvez o usuário não tenha sido encontrado ou req.body esteja vazio!`
            });
        }
    }).catch((err) => {
        res.status(500).send({
            message:
                err.message || "Erro ao atualizar o usuário com id: " + id
        });
    });
}

exports.delete = (req, res) => {
    const id = req.params.id;

    User.destroy({
        where: { id: id }
    }).then(num => {
        if (num == 1) {
            res.send({
                message: "O usuário foi excluído com sucesso!"
            });
        } else {
            res.send({
                message: `Não é possível excluir o usuário com id: ${id}. Talvez o usuário não tenha sido encontrado!`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message:
                err.message || "Não foi possível excluir o usuário com id: " + id
        });
    });
}

exports.deleteAll = (req, res) => {
    User.destroy({
        where: {},
        truncate: false
    }).then(nums => {
        res.send({ message: `${nums} usuários foram excluídos com sucesso!` });
    }).catch(err => {
        res.status(500).send({
            message:
                err.message || "Ocorreu algum erro ao remover todos os usuários!"
        });
    });

}