const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {

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

exports.signin = async (req, res) => {
  try {

    const { username, password } = req.body;

    if (!username || !password) {
      return res.json({ message: "Por favor insira todos os campos!" })
    }

    const user = await User.findOne({
      where: {
        username: username,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "Usuário não encontrado.",
        type: "error",
      });
    }

    const passwordIsValid = bcrypt.compareSync(
      password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).json({
        message: "Senha Invalida!",
        type: "error",
      });
    }

    const accessToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 horas
    });

    const refreshToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 172800, // 2 dias
    });

    await User.update({ isOnline: true, refreshToken: refreshToken }, { where: { id: user.id } })

    res.cookie("refreshtoken", refreshToken, {
      httpOnly: true,
    });

    return res.cookie("accesstoken", accessToken).status(200).json({
      type: "success",
      message: "Login bem-sucedido!"
    });

  } catch (error) {
    res.status(500).json({
      type: "error",
      message: "Erro ao fazer login!",
      error: error
    });
  }
};

exports.signout = async (req, res) => {
  try {
    const { accesstoken } = req.cookies;

    if (!accesstoken)
      return res.status(500).json({
        message: "Nenhum token de atualização! ",
        type: "error",
      });

    let id;

    try {
      id = jwt.verify(accesstoken, config.secret).id;
    } catch (error) {
      return res.status(401).json({
        message: "Token de atualização inválido!",
        type: "error",
        error
      });
    }

    if (!id)
      return res.status(401).json({
        message: "Token de atualização Vazio!",
        type: "error",
      });

    const user = await User.findOne({
      where: {
        id: id,
      },
    });

    if (!user)
      return res.status(401).json({
        message: "O usuário não existe!",
        type: "error",
      });

    User.update({ isOnline: false, refreshToken: null }, { where: { id: user.id } });

    res.clearCookie("accesstoken");
    res.clearCookie("refreshtoken");

    return res.status(200).json({
      message: "Desconectado com sucesso!",
      type: "success",
    });

  } catch (error) {
    res.status(500).json({
      message: "Erro ao se desconectar!",
      type: "error",
      error
    });
  }
};

exports.refresh_token = async (req, res) => {
  try {
    const { refreshtoken } = req.cookies;

    if (!refreshtoken)
      return res.status(500).json({
        message: "Nenhum token de atualização!",
        type: "error",
      });

    let id;

    try {
      id = jwt.verify(refreshtoken, config.secret).id;
    } catch (error) {
      return res.status(401).json({
        message: "Token de atualização inválido!",
        type: "error",
        error
      });
    }

    if (!id)
      return res.status(401).json({
        message: "Token de atualização Vazio!",
        type: "error",
      });

    const user = await User.findOne({
      where: {
        id: id,
      },
    });

    if (!user)
      return res.status(401).json({
        message: "O usuário não existe!",
        type: "error",
      });

    if (user.refreshToken !== refreshtoken)
      return res.status(401).json({
        message: "Token de atualização inválido!",
        type: "error",
      });

    const accessToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 horas
    });

    const refreshToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 172800, // 2 dias
    });

    User.update({ refreshToken: refreshToken }, { where: { id: user.id } })

    res.cookie("refreshtoken", refreshToken, {
      httpOnly: true,
    });

    return res.cookie("accesstoken", accessToken).status(200).json({
      type: "success",
      message: "Atualizado com sucesso!"
    });

  } catch (error) {
    res.status(500).json({
      message: "Erro ao atualizar o token!",
      type: "error",
      error
    });
  }
};