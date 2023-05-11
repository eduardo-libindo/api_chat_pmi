const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: false,

  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.room = require("../models/room.model.js")(sequelize, Sequelize);
db.sector = require("../models/sector.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  as:"UserRole",
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId",
});

db.user.belongsToMany(db.role, {
  as:"UserRole",
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
});

db.sector.belongsToMany(db.room, {
  as:"RoomSector",
  through:"room_sectors",
  foreignKey: "sectorId",
  otherKey: "roomId"
});

db.room.belongsToMany(db.sector, {
  as:"RoomSector",
  through: "room_sectors",
  foreignKey:"roomId",
  otherKey:"sectorId"
});

db.ROLES = ["user", "admin", "moderator"];
db.SECTORES = 
[
  "administracao", 
  "agricultura", 
  "educacao",
  "esporte_cultura",
  "faps",
  "fazenda",
  "fundacao",
  "gabinete",
  "industria_comercio",
  "meio_ambiente",
  "obras",
  "relacoes_comunitarias",
  "relacoes_institucionais",
  "saude",
  "servicos_urbanos",
  "assistencia_social"
];

module.exports = db;