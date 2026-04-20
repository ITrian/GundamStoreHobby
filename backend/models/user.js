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
			phone: {
				type: DataTypes.STRING(10),
				allowNull: true,
				validate: {
					is: /^[0-9]{10}$/,
					len: [10, 10],
				},
				unique: true,
				defaultValue: null,
			}
		},
		{
			tableName: "user",
			timestamps: false,
		},
	);

	return User;
};
