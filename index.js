const express = require('express')
const mongoose = require("mongoose");
const userRouter = require("./ROUTERS/userRouter");
const taskRouter = require("./ROUTERS/taskRouter");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT // 5555;

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kzhds.mongodb.net/?retryWrites=true&w=majority`)
console.log(mongoose.connection.readyState)


app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(PORT, () => {
   console.log("Server is up on PORT " + PORT);
});
