const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Token = sequelize.define(
        "Token", 
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            token: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            username: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            issuedat: {
                type: DataTypes.DATE,
                allowNull: false
            },
            expiresat: {
                type: DataTypes.DATE,
                allowNull: false
            },
            isrevoked: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            }
        },
        {
            tableName: "token",
            timestamps: false,
        },
    );

    return Token;
}