const router = require("express").Router();
const Project = require("../models/projectModel");
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/userModel");

router.post("/create-project", authMiddleware, async (req, res) => {
  try {
    const newProject = new Project(req.body);
    await newProject.save();
    res.send({
      success: true,
      data: newProject,
      message: "Project created successfully",
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

router.post("/get-all-projects", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({
      owner: req.body.userId,
    }).sort({ createdAt: -1 });
    res.send({
      success: true,
      data: projects,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

router.post("/get-project-by-id", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.body._id)
      .populate("owner")
      .populate("members.user");

    // Check if user is owner or member
    const isOwner = project.owner._id.toString() === req.user._id.toString();
    const isMember = project.members.some(
      (member) => member.user._id.toString() === req.user._id.toString(),
    );

    if (!isOwner && !isMember) {
      return res.send({
        success: false,
        message: "You don't have permission to view this project",
      });
    }

    res.send({
      success: true,
      data: project,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

router.post("/get-projects-by-role", authMiddleware, async (req, res) => {
  try {
    const userId = req.body.userId;
    const projects = await Project.find({ "members.user": userId })
      .sort({
        createdAt: -1,
      })
      .populate("owner");
    res.send({
      success: true,
      data: projects,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

router.post("/edit-project", authMiddleware, async (req, res) => {
  try {
    await Project.findByIdAndUpdate(req.body._id, req.body);
    res.send({
      success: true,
      message: "Project updated successfully",
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

router.post("/delete-project", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.body._id);

    // Check if user is owner
    if (project.owner._id.toString() !== req.user._id.toString()) {
      return res.send({
        success: false,
        message: "Only project owner can delete the project",
      });
    }

    await Project.findByIdAndDelete(req.body._id);
    res.send({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

router.post("/add-member", authMiddleware, async (req, res) => {
  try {
    const { email, role, projectId } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.send({
        success: false,
        message: "User not found",
      });
    }
    await Project.findByIdAndUpdate(projectId, {
      $push: {
        members: {
          user: user._id,
          role,
        },
      },
    });

    res.send({
      success: true,
      message: "Member added successfully",
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

router.post("/remove-member", authMiddleware, async (req, res) => {
  try {
    const { memberId, projectId } = req.body;

    const project = await Project.findById(projectId);

    // Check if user is owner or admin
    const isOwner = project.owner._id.toString() === req.user._id.toString();
    const isAdmin = project.members.some(
      (member) =>
        member.user._id.toString() === req.user._id.toString() &&
        member.role === "admin",
    );

    if (!isOwner && !isAdmin) {
      return res.send({
        success: false,
        message: "Only project owner or admin can remove members",
      });
    }

    // Prevent removing owner
    if (project.owner._id.toString() === memberId) {
      return res.send({
        success: false,
        message: "Cannot remove project owner",
      });
    }

    project.members.pull(memberId);
    await project.save();

    res.send({
      success: true,
      message: "Member removed successfully",
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

module.exports = router;
