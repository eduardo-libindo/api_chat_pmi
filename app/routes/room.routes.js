const { verifyRoom } = require("../middleware");
const rooms = require("../controllers/room.controller.js");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  // Create a new Room
  app.post("/api/rooms", [verifyRoom.checkDuplicateName, verifyRoom.checkSectoresExisted], rooms.create);

  // Retrieve all Rooms
  app.get("/api/rooms", rooms.findAll);

  // Retrieve all actives Rooms
  app.get("/api/rooms/actives", rooms.findAllActives);

  // Retrieve Room in name
  app.get("/api/rooms/search", rooms.findByName);

  // Retrieve a single Room with id
  app.get("/api/rooms/:id", rooms.findOne);

  // Update a Room with id
  app.put("/api/rooms/:id", [verifyRoom.checkSectoresExisted], rooms.update);

  // Delete a Room with id
  app.delete("/api/rooms/:id", rooms.delete);

  // Delete all Rooms
  app.delete("/api/rooms", rooms.deleteAll);
};
