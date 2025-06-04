const Blog = require("../models/blogModel");
const categoryModel = require("../models/categoryModel");

// Create a new blog (C)
const createBlog = async (req, res) => {
  try {
    const { title, author, description, category } = req.body;

    // Validate required fields
    if (!title || !author || !description || !category) {
      return res.status(400).json({
        message:
          "All required fields (title, author, description, category) must be provided",
      });
    }

    // Validate category exists
    const categoryExists = await categoryModel.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    let imageUrl = "https://via.placeholder.com/300x200"; // Default image

    if (req.file) {
      imageUrl = `${req.file.filename}`; // Path to the uploaded image
    }

    const blog = await Blog.create({
      title,
      author: req.user._id,
      description,
      category,
      image: imageUrl,
      user: req.user._id,
    });

    const populatedBlog = await Blog.findById(blog._id)
      .populate("category", "name description")
      .populate("author", "name");

    res.status(201).json({
      message: "Blog created successfully",
      blog: populatedBlog,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating blog", error: error.message });
  }
};

// Get all blogs (R)
const getAllBlogs = async (req, res) => {
  try {
    const { search, page = 1, limit = 6 } = req.query; // Default to page 1, 6 blogs per page
    const skip = (page - 1) * limit;

    let query = {};

    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } }, // Search in title
          { description: { $regex: search, $options: "i" } }, // Search in description
          // Search in category name (requires a nested query since category is populated)
          { "category.name": { $regex: search, $options: "i" } },
        ],
      };
    }

    // Use aggregation to search and paginate
    const blogs = await Blog.aggregate([
      {
        $lookup: {
          from: "categories", // The collection name for categories
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" }, // Unwind the category array
      {
        $lookup: {
          from: "users", // The collection name for users (authors)
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" }, // Unwind the author array
      { $match: query }, // Apply search query
      { $skip: parseInt(skip) }, // Skip for pagination
      { $limit: parseInt(limit) }, // Limit for pagination
    ]);

    // Get the total count for pagination
    const totalBlogs = await Blog.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      { $match: query },
      { $count: "total" },
    ]);

    const total = totalBlogs.length > 0 ? totalBlogs[0].total : 0;

    res.status(200).json({
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalBlogs: total,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching blogs", error: error.message });
  }
};

// Get a single blog by ID (R)
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "name")
      .populate("category", "name description");
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching blog", error: error.message });
  }
};

// Update a blog (U)
const updateBlog = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    if (!title || !description || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Only update if a new image is provided
    if (req.file) {
      const imageUrl = `${req.file.filename}`; // Path to the uploaded image
      blog.image = imageUrl;
    }

    blog.title = title;
    blog.description = description;
    blog.category = category;
    // Author remains unchanged (set by req.user._id on creation)

    const updatedBlog = await blog.save();
    const populatedBlog = await Blog.findById(updatedBlog._id)
      .populate("category", "name")
      .populate("author", "name");
    res.status(200).json({ blog: populatedBlog });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating blog", error: error.message });
  }
};

// Delete a blog (D)
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this blog" });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting blog", error: error.message });
  }
};

const getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user._id })
      .populate("category", "name")
      .populate("author", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(blogs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching your blogs", error: error.message });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getMyBlogs,
};
