const questionCategoryModel = require("../models/questionCategoryModel");
const questionsModel = require("../models/questionsModel");

const addQuestionCategory = async (req, res) => {
  try {
    const { userId, name } = req.body;
    const category = await questionCategoryModel.create({ userId, name });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCategoriesByUser = async (req, res) => {
  try {
    const categories = await questionCategoryModel.find({
      userId: req.params.userId,
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addQuestion = async (req, res) => {
  try {
    const { userId, categoryId, question, answer } = req.body;
    const q = await questionsModel.create({
      userId,
      categoryId,
      question,
      answer,
    });
    res.status(201).json(q);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getQuestionsByUserAndCategory = async (req, res) => {
  try {
    const { userId, categoryId } = req.params;

    const questions = await questionsModel.find({
      userId,
      categoryId,
    });

    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    await questionsModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  deleteQuestion,
  getQuestionsByUserAndCategory,
  addQuestion,
  getCategoriesByUser,
  addQuestionCategory,
};
