const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Account = sequelize.define(
    "Account",
    {
      userid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: "user",
            key: "id",
        },
        onDelete: "CASCADE",
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 255],
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      isactived: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
    },
    {
      tableName: "account",
      timestamps: false,
    },
  );

  return Account;
};
