const path = require("path");
const { Sequelize } = require("sequelize");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const initAccount = require("./account");
const initCategory = require("./category");
const initImage = require("./image");
const initInvoice = require("./invoice");
const initInvoiceDetail = require("./invoiceDetail");
const initProduct = require("./product");
const initUser = require("./user");
const initPhone = require("./phone");

const connectionString = process.env.DATABASE_URL;

const sequelize = new Sequelize(connectionString, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

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
  Category: category,
  image,
  invoice,
  invoiceDetail,
  product,
  user,
  phone,
};
