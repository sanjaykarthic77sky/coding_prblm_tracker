const express = require('express');
const router = express.Router();
const {
  getProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem,
  updateProblemStatus,
  getProblemStats,
} = require('../controllers/problemController');

// Routes for /api/problems
router.route('/').get(getProblems).post(createProblem);

// Statistics endpoint (must be defined before /:id)
router.route('/stats').get(getProblemStats);

// Routes for /api/problems/:id
router.route('/:id').get(getProblemById).put(updateProblem).delete(deleteProblem);

// Route for toggling/updating status
router.route('/:id/status').patch(updateProblemStatus);

module.exports = router;
