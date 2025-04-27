const express = require('express');
const router = express.Router();
const {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    getMyBlogs,
} = require('../controllers/blogController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../utils/multer');



router.post('/', protect, upload.single('image'), createBlog); // Create a blog (authenticated)
router.get('/', getAllBlogs); // Get all blogs (public)
router.get('/my-blogs', protect, getMyBlogs);
router.get('/:id', getBlogById); // Get a single blog by ID (public)
router.put('/:id', protect, upload.single('image'), updateBlog); // Update a blog (authenticated)
router.delete('/:id', protect, deleteBlog); // Delete a blog (authenticated)

module.exports = router;