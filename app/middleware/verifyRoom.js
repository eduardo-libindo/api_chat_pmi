const db = require("../models");
const SECTORES = db.SECTORES;
const Room = db.room;

checkDuplicateName = async (req, res, next) => {
  try {
    // name
    let room = await Room.findOne({
      where: {
        name: req.body.name,
        sector: req.body.sector
      },
    });

    if (room) {
      return res.status(400).send({
        message: `Falha! O nome "${req.body.name}" da sala já está em uso no setor "${req.body.sector}"!`,
      });
    }

    next();
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

checkSectoresExisted = (req, res, next) => {
  if (req.body.sectores) {
    for (let i = 0; i < req.body.sectores.length; i++) {
      if (!SECTORES.includes(req.body.sectores[i])) {
        res.status(400).send({
          message: "Falha! Este setor não existe: " + req.body.sectores[i],
        });
        return;
      }
    }
  }

  next();
};

const verifyRoom = {
    checkDuplicateName,
    checkSectoresExisted,
  };
  
  module.exports = verifyRoom;