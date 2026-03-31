const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
	const Category = sequelize.define(
		"Category",
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
		},
		{
			tableName: "category",
			timestamps: false,
		},
	);

	return Category;
};
