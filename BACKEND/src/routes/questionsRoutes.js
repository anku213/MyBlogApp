const express = require("express");
const { addQuestionCategory, getCategoriesByUser, addQuestion, getQuestionsByUserAndCategory, deleteQuestion } = require("../controllers/questionCategoryController");
const router = express.Router();

// Create Question category
router.post("/category", addQuestionCategory);

// Get categories by user
router.get("/categories/:userId", getCategoriesByUser);

// Create question
router.post("/question", addQuestion);

// Get questions by user and category
router.get("/questions/:userId/:categoryId", getQuestionsByUserAndCategory);

// Delete question
router.delete("/question/:id", deleteQuestion);

module.exports = router;
