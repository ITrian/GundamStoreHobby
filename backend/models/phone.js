const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Phone = sequelize.define(
        "Phone",
        {
            userId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                field: "userid",
                references: {
                    model: "user",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            phoneNumber: {
                type: DataTypes.STRING(10),
                primaryKey: true,
                allowNull: false,
                field: "phonenumber",
            }
        },
        {
            tableName: "phone",
            timestamps: false,
            freezeTableName: true,
        }
    );
    return Phone;
};