require("dotenv").config();
const express = require("express");
const { statusCodes } = require("./models/errors");
const usersController = require("./controllers/users");

const PORT = process.env.PORT ?? 8000;

const app = express();

// Middleware
app.use(express.json());

//controllers
app.use("/api/v1/users", usersController).use("/", express.static("dist"));

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
