const express = require("express");
const bodyParser = require("body-parser");
require("./mongodb");
const userRoutes = require("./routes/userRoutes");

const taskRoutes = require("./routes/taskRoutes");

const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 8081;

app.use(bodyParser.json());

app.use("/users", userRoutes);

app.use("/tasks", taskRoutes);

app.get("/", async (req, res) => {
  let db = await dbConnect();
  //   db = await db.find().toArray();
  console.log({ db });
  res.json({
    message: "Task manager API is Working here eess!",
  });
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
