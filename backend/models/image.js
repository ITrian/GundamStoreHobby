const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
	const Image = sequelize.define(
		"Image",
		{
			productid: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				allowNull: false,
			},
			detail: {
				type: DataTypes.STRING(255),
				primaryKey: true,
				allowNull: false,
			},
			link: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
		},
		{
			tableName: "image",
			timestamps: false,
		},
	);

	return Image;
};
