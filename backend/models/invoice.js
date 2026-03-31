const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
	const Invoice = sequelize.define(
		"Invoice",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			date: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			customerid: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			status: {
				type: DataTypes.STRING(100),
				allowNull: false,
			},
			ispaid: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			paymentmethod: {
				type: DataTypes.STRING(100),
				allowNull: true,
			},
			totalprice: {
				type: DataTypes.DECIMAL(12, 2),
				allowNull: false,
			},
		},
		{
			tableName: "invoice",
			timestamps: false,
		},
	);

	return Invoice;
};
