const express = require("express");
require("dotenv").config();
const { statusCodes } = require("./models/errors");
const dummyController = require("./controllers/DummyTable");

const PORT = process.env.PORT ?? 8000;

const app = express();

// Middleware
app.use(express.json());
app.use("/api/v1/dummy", dummyController).use("/", express.static("dist"));

//TODO: note, controller for Users (maybe tie into admin page user view) and Posts (Viewing your own vs friends posts may look different)
//TODO: each controller should be able to access the database and perform CRUD operations

//error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;

  const error = {
    status,
    message: err.message || statusCodes.INTERNAL_SERVER_ERROR,
  };
  res.status(status).send(error);
});

app.listen(PORT, () => {
  console.log(`
    Server is running at http://localhost:${PORT}`);
});
