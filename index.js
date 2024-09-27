require('dotenv').config()

const express = require("express");
const userRoutes = require("./routes/user");
const courseRoutes = require("./routes/course");
const adminRoute = require("./routes/admin");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());

app.use("/user", userRoutes);
app.use("/course", courseRoutes);
app.use("/admin", adminRoute);


async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(3000);
    console.log("listening to port now");
}

main();
