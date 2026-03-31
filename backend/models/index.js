const { Sequelize } = require("sequelize");
require("dotenv").config();

const initAccount = require("./account");
const initCategory = require("./category");
const initImage = require("./image");
const initInvoice = require("./invoice");
const initInvoiceDetail = require("./invoiceDetail");
const initProduct = require("./product");
const initUser = require("./user");
const initPhone = require("./phone");

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        dialect: "postgres",
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    }
);

const account = initAccount(sequelize);
const category = initCategory(sequelize);
const image = initImage(sequelize);
const invoice = initInvoice(sequelize);
const invoiceDetail = initInvoiceDetail(sequelize);
const product = initProduct(sequelize);
const user = initUser(sequelize);
const phone = initPhone(sequelize);

invoice.hasMany(invoiceDetail, { foreignKey: "invoiceid" });
invoiceDetail.belongsTo(invoice, { foreignKey: "invoiceid" });

product.hasMany(image, { foreignKey: "productid" });
image.belongsTo(product, { foreignKey: "productid" });

product.belongsTo(category, { foreignKey: "categoryid" });
category.hasMany(product, { foreignKey: "categoryid" });

user.hasOne(account, { foreignKey: "userid" });
account.belongsTo(user, { foreignKey: "userid" });

user.hasMany(phone, { foreignKey: "userId" });
phone.belongsTo(user, { foreignKey: "userId" });

module.exports = {
    sequelize,
    account,
    category,
    image,
    invoice,
    invoiceDetail,
    product,
    user,
    phone,
};