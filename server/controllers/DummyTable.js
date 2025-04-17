const express = require("express");
const router = express.Router();
const model = require("../models/DummyTable");

router
  .get("/", (req, res, next) => {
    model
      .getAll()
      .then((data) => {
        res.send(data);
      })
      .catch(next);
  })
  .post("/", (req, res, next) => {
    const newValues = req.body;

    model
      .create(newValues)
      .then((data) => {
        res.status(201).send(data);
      })
      .catch(next);
  })
  .patch("/:id", (req, res, next) => {
    const id = req.params.id;
    const newValues = req.body;

    model
      .update(id, newValues)
      .then((data) => {
        res.send(data);
      })
      .catch(next);
  })
  .delete("/:id", (req, res, next) => {
    const id = req.params.id;

    model
      .getById(id)
      .then((record) => {
        if (!record) {
          // If record doesn't exist, send a 404 error
          return res
            .status(404)
            .send({ error: `Record with ID ${id} not found` });
        }
        // If record exists, proceed with deletion
        return model.remove(id);
      })
      .then((data) => {
        if (data) {
          // Only process response if data exists (not returned from error condition)
          res.send(data);
        }
      })
      .catch(next);
  });

module.exports = router;
