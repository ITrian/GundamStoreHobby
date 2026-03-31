const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
	const InvoiceDetail = sequelize.define(
		"InvoiceDetail",
		{
			invoiceid: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				allowNull: false,
			},
			productid: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				allowNull: false,
			},
			unitprice: {
				type: DataTypes.DECIMAL(12, 2),
				allowNull: false,
			},
			quantity: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			discount: {
				type: DataTypes.DECIMAL(5, 2),
				allowNull: false,
				defaultValue: 0,
			},
		},
		{
			tableName: "invoicedetail",
			timestamps: false,
		},
	);

	return InvoiceDetail;
};
