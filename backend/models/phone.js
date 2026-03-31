const { DataTypes } = require('sequelize');
const { sequelize } = require('.');

module.exports = (sequelize) => {
    const Phone = sequelize.define(
        "Phone",
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "user",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            phoneNumber: {
                type: DataTypes.STRING(10),
                allowNull: false,
            }
        },
        {
            tableName: "phone",
            timestamps: false,
            freezeTAbleName: true,
        }
    )
    return Phone;
}