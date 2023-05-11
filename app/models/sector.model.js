module.exports = (sequelize, Sequelize) => {
    const Sector = sequelize.define("sectores", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING
        }
    });

    return Sector;
};