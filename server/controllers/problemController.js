const mongoose = require('mongoose');
const Problem = require('../models/Problem');
const { getIsConnected } = require('../config/db');
const localStore = require('../data/localStore');

// @desc    Get all problems (with optional search and filter queries)
// @route   GET /api/problems
// @access  Public
const getProblems = async (req, res) => {
  try {
    const { search, platform, difficulty, topic, status } = req.query;

    if (getIsConnected()) {
      let query = {};

      if (platform && platform !== 'All') query.platform = platform;
      if (difficulty && difficulty !== 'All') query.difficulty = difficulty;
      if (status && status !== 'All') query.status = status;
      if (topic && topic !== 'All') query.topic = { $regex: topic, $options: 'i' };

      if (search && search.trim() !== '') {
        const searchRegex = new RegExp(search.trim(), 'i');
        query.$or = [
          { title: searchRegex },
          { topic: searchRegex },
          { platform: searchRegex },
          { notes: searchRegex },
        ];
      }

      const problems = await Problem.find(query).sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: problems.length,
        data: problems,
      });
    } else {
      const problems = localStore.find({ search, platform, difficulty, topic, status });
      return res.status(200).json({
        success: true,
        count: problems.length,
        data: problems,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching problems',
      error: error.message,
    });
  }
};

// @desc    Get single problem by ID
// @route   GET /api/problems/:id
// @access  Public
const getProblemById = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid Problem ID format',
        });
      }

      const problem = await Problem.findById(id);

      if (!problem) {
        return res.status(404).json({
          success: false,
          message: 'Problem not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: problem,
      });
    } else {
      const problem = localStore.findById(id);

      if (!problem) {
        return res.status(404).json({
          success: false,
          message: 'Problem not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: problem,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching problem details',
      error: error.message,
    });
  }
};

// @desc    Create a new problem
// @route   POST /api/problems
// @access  Public
const createProblem = async (req, res) => {
  try {
    const { title, platform, difficulty, topic, status, link, notes } = req.body;

    if (!title || !platform || !difficulty || !topic) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, platform, difficulty, topic',
      });
    }

    if (getIsConnected()) {
      const problem = await Problem.create({
        title: title.trim(),
        platform,
        difficulty,
        topic: topic.trim(),
        status: status || 'Unsolved',
        link: link ? link.trim() : '',
        notes: notes ? notes.trim() : '',
      });

      return res.status(201).json({
        success: true,
        message: 'Problem added successfully',
        data: problem,
      });
    } else {
      const problem = localStore.create({
        title,
        platform,
        difficulty,
        topic,
        status,
        link,
        notes,
      });

      return res.status(201).json({
        success: true,
        message: 'Problem added successfully',
        data: problem,
      });
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating problem',
      error: error.message,
    });
  }
};

// @desc    Update an existing problem
// @route   PUT /api/problems/:id
// @access  Public
const updateProblem = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid Problem ID format',
        });
      }

      const problem = await Problem.findById(id);

      if (!problem) {
        return res.status(404).json({
          success: false,
          message: 'Problem not found to update',
        });
      }

      const updatedProblem = await Problem.findByIdAndUpdate(
        id,
        {
          title: req.body.title ? req.body.title.trim() : problem.title,
          platform: req.body.platform || problem.platform,
          difficulty: req.body.difficulty || problem.difficulty,
          topic: req.body.topic ? req.body.topic.trim() : problem.topic,
          status: req.body.status || problem.status,
          link: req.body.link !== undefined ? req.body.link.trim() : problem.link,
          notes: req.body.notes !== undefined ? req.body.notes.trim() : problem.notes,
        },
        { new: true, runValidators: true }
      );

      return res.status(200).json({
        success: true,
        message: 'Problem updated successfully',
        data: updatedProblem,
      });
    } else {
      const updatedProblem = localStore.findByIdAndUpdate(id, req.body);

      if (!updatedProblem) {
        return res.status(404).json({
          success: false,
          message: 'Problem not found to update',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Problem updated successfully',
        data: updatedProblem,
      });
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating problem',
      error: error.message,
    });
  }
};

// @desc    Delete a problem
// @route   DELETE /api/problems/:id
// @access  Public
const deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid Problem ID format',
        });
      }

      const problem = await Problem.findById(id);

      if (!problem) {
        return res.status(404).json({
          success: false,
          message: 'Problem not found to delete',
        });
      }

      await Problem.findByIdAndDelete(id);

      return res.status(200).json({
        success: true,
        message: 'Problem deleted successfully',
        data: { id },
      });
    } else {
      const deleted = localStore.findByIdAndDelete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Problem not found to delete',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Problem deleted successfully',
        data: { id },
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while deleting problem',
      error: error.message,
    });
  }
};

// @desc    Update problem solved status
// @route   PATCH /api/problems/:id/status
// @access  Public
const updateProblemStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (getIsConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid Problem ID format',
        });
      }

      const problem = await Problem.findById(id);

      if (!problem) {
        return res.status(404).json({
          success: false,
          message: 'Problem not found',
        });
      }

      const newStatus = status ? status : problem.status === 'Solved' ? 'Unsolved' : 'Solved';

      if (!['Solved', 'Unsolved'].includes(newStatus)) {
        return res.status(400).json({
          success: false,
          message: 'Status must be either "Solved" or "Unsolved"',
        });
      }

      problem.status = newStatus;
      await problem.save();

      return res.status(200).json({
        success: true,
        message: `Problem marked as ${newStatus}`,
        data: problem,
      });
    } else {
      const problem = localStore.findById(id);

      if (!problem) {
        return res.status(404).json({
          success: false,
          message: 'Problem not found',
        });
      }

      const newStatus = status ? status : problem.status === 'Solved' ? 'Unsolved' : 'Solved';
      const updated = localStore.findByIdAndUpdate(id, { status: newStatus });

      return res.status(200).json({
        success: true,
        message: `Problem marked as ${newStatus}`,
        data: updated,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating problem status',
      error: error.message,
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/problems/stats
// @access  Public
const getProblemStats = async (req, res) => {
  try {
    let problems = [];

    if (getIsConnected()) {
      problems = await Problem.find({});
    } else {
      problems = localStore.find({});
    }

    const total = problems.length;
    const solved = problems.filter((p) => p.status === 'Solved').length;
    const unsolved = total - solved;
    const easy = problems.filter((p) => p.difficulty === 'Easy').length;
    const medium = problems.filter((p) => p.difficulty === 'Medium').length;
    const hard = problems.filter((p) => p.difficulty === 'Hard').length;
    const solvedPercentage = total > 0 ? Math.round((solved / total) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        total,
        solved,
        unsolved,
        easy,
        medium,
        hard,
        solvedPercentage,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while calculating statistics',
      error: error.message,
    });
  }
};

module.exports = {
  getProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem,
  updateProblemStatus,
  getProblemStats,
};
