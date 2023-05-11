const express = require("express");
const helmet = require("helmet");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();

const corsOptions = {
  origin: "http://localhost:4200",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(helmet());

// database
const db = require("./app/models");
const Role = db.role;
const Sector = db.sector;
const User = db.user;

db.sequelize
  .sync({ force: true }) // { force: true } descartará a tabela se ela já existir
  .then(() => {
    console.log("Drop and Re-Sync db.");
    initialUsers(); // chama o metado de inicialização dos Usuarios
    initialRoles(); // chama o metado de inicialização das Roles
    initialSectores(); // chama o metado de inicialização dos Sectores
  })
  .catch((err) => {
    console.log("Failed to Sync db: " + err.message);
  });

// simple route
app.get("/", (req, res) => {
  res.json({
    message: "Bem-vindo a API chat_pmi.",
  });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/room.routes")(app);
require("./app/routes/role.routes")(app);
require("./app/routes/sector.routes")(app);

// definir porta, ouvir solicitações
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


// Metado de inicialização de ususarios
async function initialUsers() {

  const user = await User.create({
    firstName: "user",
    secondName: "user",
    username: "user",
    email: "user@user.com",
    password: bcrypt.hashSync("user123", 8),
    role: 1,
    isActive: true,
    isOnline: false
  });

  user.setUserRole(1);

  const moderator = await User.create({
    firstName: "moderator",
    secondName: "moderator",
    username: "moderator",
    email: "moderator@moderator.com",
    password: bcrypt.hashSync("moderator123", 8),
    role: 2,
    isActive: true,
    isOnline: false
  });

  moderator.setUserRole(2);

  const admin = await User.create({
    firstName: "admin",
    secondName: "admin",
    username: "admin",
    email: "admin@admin.com",
    password: bcrypt.hashSync("admin123", 8),
    role: 3,
    isActive: true,
    isOnline: false
  });

  admin.setUserRole(3);

  const eduardo = await User.create({
    firstName: "Eduardo",
    secondName: "Libindo",
    username: "eduardo.libindo",
    email: "eduardolibindo@hotmail.com",
    password: "$2a$08$JZPbE2SQKpmG.R0MvtDSH.y41U0oOg43snktwaoWlo2bpONTYsGZW",
    role: 3,
    isActive: true,
    isOnline: false
  });

  eduardo.setUserRole(3);

}

// Metodo de inicialização das Roles
function initialRoles() {
  Role.create({
    id: 1,
    name: "user",
  });

  Role.create({
    id: 2,
    name: "moderator",
  });

  Role.create({
    id: 3,
    name: "admin",
  });

}

// Metodo de inicialização dos Sectores
function initialSectores() {
  Sector.create({
    id: 1,
    name: "administracao",
  });

  Sector.create({
    id: 2,
    name: "agricultura",
  });

  Sector.create({
    id: 3,
    name: "educacao",
  });

  Sector.create({
    id: 4,
    name: "esporte_cultura",
  });

  Sector.create({
    id: 5,
    name: "faps",
  });

  Sector.create({
    id: 6,
    name: "fazenda",
  });

  Sector.create({
    id: 7,
    name: "fundacao",
  });

  Sector.create({
    id: 8,
    name: "gabinete",
  });

  Sector.create({
    id: 9,
    name: "industria_comercio",
  });

  Sector.create({
    id: 10,
    name: "meio_ambiente",
  });

  Sector.create({
    id: 11,
    name: "obras",
  });

  Sector.create({
    id: 12,
    name: "relacoes_comunitarias",
  });

  Sector.create({
    id: 13,
    name: "relacoes_institucionais",
  });

  Sector.create({
    id: 14,
    name: "saude",
  });

  Sector.create({
    id: 15,
    name: "servicos_urbanos",
  });

  Sector.create({
    id: 16,
    name: "assistencia_social",
  });

}