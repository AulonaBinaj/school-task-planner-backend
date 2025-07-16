const express = require("express");
const { connectToDB } = require("./db");
const tasksRoutes = require("./routes/tasks");
const studentsRoutes = require("./routes/students");

const cors = require("cors");

const app = express();
const PORT = 3000;
app.use(cors({ origin: "http://localhost:4200" }));

app.use(express.json());
app.use("/tasks", tasksRoutes);
app.use("/students", studentsRoutes);

connectToDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
