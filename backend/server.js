const express = require('express');

const pool = require("./db");

pool.connect();

const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();
app.use(express.json());

app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
