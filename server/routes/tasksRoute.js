const router = require("express").Router();

const Task = require("../models/taskModel");
const Project = require("../models/projectModel");
const User = require("../models/userModel");
const authMiddleware = require("../middlewares/authMiddleware");
const cloudinary = require("../config/cloudinaryConfig");
const multer = require("multer");

router.post("/create-task", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.body.project);

    // Check if user is owner, admin, or employee of the project
    const isOwner = project.owner._id.toString() === req.user._id.toString();
    const isAdmin = project.members.some(
      (member) =>
        member.user._id.toString() === req.user._id.toString() &&
        member.role === "admin",
    );
    const isEmployee = project.members.some(
      (member) =>
        member.user._id.toString() === req.user._id.toString() &&
        member.role === "employee",
    );

    if (!isOwner && !isAdmin && !isEmployee) {
      return res.send({
        success: false,
        message: "You don't have permission to create tasks in this project",
      });
    }

    const newTask = new Task(req.body);
    await newTask.save();
    res.send({
      success: true,
      message: "Task created successfully",
      data: newTask,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

router.post("/get-all-tasks", authMiddleware, async (req, res) => {
  try {
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] === "all") {
        delete req.body[key];
      }
    });
    delete req.body["userId"];
    const tasks = await Task.find(req.body)
      .populate("assignedTo")
      .populate("assignedBy")
      .populate("project")
      .sort({ createdAt: -1 });
    res.send({
      success: true,
      message: "Tasks fetched successfully",
      data: tasks,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

router.post("/update-task", authMiddleware, async (req, res) => {
  try {
    await Task.findByIdAndUpdate(req.body._id, req.body);
    res.send({
      success: true,
      message: "Task updated successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

router.post("/delete-task", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.body._id).populate("project");

    // Check if user is owner or admin of the project
    const isOwner =
      task.project.owner._id.toString() === req.user._id.toString();
    const isAdmin = task.project.members.some(
      (member) =>
        member.user._id.toString() === req.user._id.toString() &&
        member.role === "admin",
    );

    if (!isOwner && !isAdmin) {
      return res.send({
        success: false,
        message: "Only project owner or admin can delete tasks",
      });
    }

    await Task.findByIdAndDelete(req.body._id);
    res.send({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

router.post(
  "/upload-image",
  authMiddleware,
  multer({ storage: storage }).single("file"),
  async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "tasks",
      });
      const imageURL = result.secure_url;

      await Task.findOneAndUpdate(
        { _id: req.body.taskId },
        {
          $push: {
            attachments: imageURL,
          },
        },
      );

      res.send({
        success: true,
        message: "Image uploaded successfully",
        data: imageURL,
      });
    } catch (error) {
      res.send({
        success: false,
        message: error.message,
      });
    }
  },
);

module.exports = router;
