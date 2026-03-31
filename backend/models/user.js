const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
	const User = sequelize.define(
		"User",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING(255),
				allowNull: false,
			},
			dateofbirth: {
				type: DataTypes.DATEONLY,
				allowNull: true,
			},
			email: {
				type: DataTypes.STRING(255),
				allowNull: true,
			},
			address: {
				type: DataTypes.STRING(255),
				allowNull: true,
			},
			isadmin: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
		},
		{
			tableName: "user",
			timestamps: false,
		},
	);

	return User;
};
