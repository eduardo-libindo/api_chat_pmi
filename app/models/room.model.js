module.exports = (sequelize, Sequelize) => {
    const Room = sequelize.define("rooms", {
        name: {
            type: Sequelize.STRING
        },
        sector: {
            type: Sequelize.INTEGER
        },
        isActive: {
            type: Sequelize.BOOLEAN
        }
    });

    return Room;
};