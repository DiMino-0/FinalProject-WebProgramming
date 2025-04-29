require("dotenv").config();
const express = require("express");
const usersController = require("./controllers/users");

const PORT = process.env.PORT ?? 8000;

const app = express();

// Middleware
// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
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
