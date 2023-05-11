const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

protected = async (req, res, next) => {
  const { accesstoken } = req.cookies;

  if (!accesstoken)
    return res.status(401).json({
      message: "Nenhum token!",
      type: "error",
    });

  let id;

  try {
    id = jwt.verify(accesstoken, config.secret).id;
  } catch {
    return res.status(401).json({
      message: "Token invalido!",
      type: "error",
    });
  }

  if (!id)
    return res.status(401).json({
      message: "Token invalido!",
      type: "error",
    });

  const user = await User.findOne({
    where: {
      id: id
    },
  });

  if (!user)
    return res.status(401).json({
      message: "O usuário não existe!",
      type: "error",
    });

  req.user = user;

  next();

}

protectedRoute = async (req, res) => {
  try {
    // se o usuário existir na requisição, envia os dados
    if (req.user)
      return res.status(200).json({
        message: "Você está logado!",
        type: "success",
        user: req.user,
      });
    // se o usuário não existir, retorna o erro
    return res.status(401).json({
      message: "Você não está logado!",
      type: "error",
    });

  } catch (error) {
    res.status(500).json({
      message: "Erro ao obter a rota protegida!",
      type: "error",
      error,
    });
  }
}

const authJwt = {
  protected,
  protectedRoute
};
module.exports = authJwt;