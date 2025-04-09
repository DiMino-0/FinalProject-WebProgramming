const express = require("express");
const { statusCodes } = require("./models/errors");
const app = express();
//TODO: Use the port our hosting provides
const PORT = 8000;

// Middleware
app.use(express.json());

app.use("/", express.static("dist"));
//TODO: controller for Users (maybe tie into admin page user view) and Posts (Viewing your own vs friends posts may look different)

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
  console.log(`Server is running on http://localhost:${PORT}`);
});
