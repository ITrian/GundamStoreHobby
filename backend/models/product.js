const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
	const Product = sequelize.define(
		"Product",
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
			quantity: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			detail: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			categoryid: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			price: {
				type: DataTypes.DECIMAL(12, 2),
				allowNull: false,
			},
			createat: {
				type: DataTypes.DATE,
				allowNull: false,
			},
		},
		{
			tableName: "product",
			timestamps: false,
		},
	);

	return Product;
};
