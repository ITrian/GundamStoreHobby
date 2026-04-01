const express = require('express');
const cors = require('cors');

const pool = require("./db");

const PORT = process.env.PORT || 3000;

const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const imageRoutes = require("./routes/imageRoutes");
const productRoutes = require("./routes/productRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const invoiceDetailRoutes = require("./routes/invoiceDetailRoutes");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/images", imageRoutes);
app.use("/products", productRoutes);
app.use("/invoices", invoiceRoutes);
app.use("/invoiceDetails", invoiceDetailRoutes);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
