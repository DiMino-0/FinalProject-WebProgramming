const router = require("express").Router();
const model = require("../models/DummyTable");

router
  .get("/", (req, res, next) => {
    model.getAll().catch(next);
  })
  .post("/", (req, res, next) => {
    const newValues = req.body;

    model.create(newValues).catch(next);
  });

module.exports = router;
