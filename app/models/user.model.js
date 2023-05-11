module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        firstName:{
            type: Sequelize.STRING
        },
        secondName:{
            type: Sequelize.STRING
        },
        username: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        role: {
            type: Sequelize.INTEGER
        },
        isActive: {
            type: Sequelize.BOOLEAN
        },
        isOnline: {
            type: Sequelize.BOOLEAN
        },
        refreshToken:{
            type: Sequelize.STRING
        }
    });

    return User;
};