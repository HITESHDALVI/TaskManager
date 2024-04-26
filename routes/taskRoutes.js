const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Task = require("../models/taskSchema");

router.get("/test", auth, async (req, res) => {
  res.json({ message: "task routes working", user: req.user });
});

// curd tasks

router.post("/create-task", auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      owner: req.user._id,
    });
    await task.save();
    res.status(201).json({
      task,
      message: "Task Created Successfully",
    });
  } catch (err) {
    res.status(400).send({
      error: err,
    });
  }
});
router.get("/get-task", auth, async (req, res) => {
  try {
    const task = await Task.find({
      owner: req.user._id,
    });

    res.status(200).json({
      task,
      message: "Task fetched Successfully",
    });
  } catch (err) {
    res.status(400).send({
      error: err,
    });
  }
});

router.get("/get-task/:id", auth, async (req, res) => {
  try {
    const task_id = req.params.id;
    const task = await Task.findOne({
      _id: task_id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).json({
        message: "Record not found",
      });
    }
    res.status(200).json({
      task,
      message: "Task fetched Successfully",
    });
  } catch (err) {
    res.status(400).send({
      error: err,
    });
  }
});

router.patch("/update-task/:id", auth, async (req, res) => {
  try {
    const task_id = req.params.id;
    const updates = Object.keys(req.body);
    const allowed_keys = ["description", "completed", "title"];
    const isValidOperation = updates.every((update) =>
      allowed_keys.includes(update)
    );
    if (!isValidOperation) {
      return res.status(400).json({
        message: "Attempt to update immutable data",
      });
    }
    const task = await Task.findOne({
      _id: task_id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).json({
        message: "Record not found",
      });
    }
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.status(200).json({
      task,
      message: "Task updated Successfully",
    });
  } catch (err) {
    console.log({ err });
    res.status(400).send({
      error: err,
    });
  }
});

router.delete("/delete-task/:id", auth, async (req, res) => {
  try {
    const task_id = req.params.id;
    const task = await Task.findOneAndDelete({
      _id: task_id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).json({
        message: "Record not found",
      });
    }
    res.status(200).json({
      task,
      message: "Task Deleted Successfully",
    });
  } catch (err) {
    res.status(400).send({
      error: err,
    });
  }
});
module.exports = router;
