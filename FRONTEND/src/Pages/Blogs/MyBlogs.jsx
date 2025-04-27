import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Grid, // Use Grid2 instead of Grid
    Card,
    CardContent,
    CardMedia,
    Typography,
    TextField,
    Button,
    Modal,
    Box,
    IconButton,
    InputAdornment,
    Chip,
    MenuItem,
    Select,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import {
    createBlog,
    getMyBlogs,
    updateBlog,
    deleteBlog,
} from '../../Api/blogsApi';
import { getAllCategories } from '../../Api/categoriesApi';

const MyBlogs = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentBlogId, setCurrentBlogId] = useState(null);
    const userData = localStorage.getItem('user');
    const parsedUserData = userData ? JSON.parse(userData) : { name: '', userId: '' };
    const [newBlog, setNewBlog] = useState({
        title: '',
        author: parsedUserData.name, // Pre-fill with logged-in user's name
        description: '',
        category: '',
        image: null,
    });


    useEffect(() => {
        fetchMyBlogs();
        fetchCategories();
    }, []);

    const fetchMyBlogs = async () => {
        try {
            const fetchedBlogs = await getMyBlogs();
            setBlogs(fetchedBlogs);
        } catch (error) {
            toast.error(error.message || 'Failed to fetch your blogs');
        }
    };

    const fetchCategories = async () => {
        try {
            const fetchedCategories = await getAllCategories();
            setCategories(fetchedCategories);
        } catch (error) {
            toast.error(error.message || 'Failed to fetch categories');
        }
    };

    const handleOpen = (blog = null) => {
        if (blog) {
            setEditMode(true);
            setCurrentBlogId(blog._id);
            setNewBlog({
                title: blog.title,
                author: blog.author.name || blog.author, // Use populated author name
                description: blog.description,
                category: blog.category._id,
                image: null,
            });
        } else {
            setEditMode(false);
            setNewBlog({
                title: '',
                author: parsedUserData.name, // Pre-fill with logged-in user's name
                description: '',
                category: '',
                image: null,
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditMode(false);
        setCurrentBlogId(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBlog((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setNewBlog((prev) => ({ ...prev, image: file }));
    };

    const handleAddOrUpdateBlog = async () => {
        try {
            console.log('hre')
            if (!newBlog.title || !newBlog.description || !newBlog.category ) {
                toast.error('All required fields must be filled');
                return;
            }

            const blogData = {
                title: newBlog.title,
                description: newBlog.description,
                category: newBlog.category,
                image: newBlog.image,
                author: parsedUserData.userId, // Use logged-in user's ID
            };

            if (editMode) {
                const updatedBlog = await updateBlog(currentBlogId, blogData);
                setBlogs((prev) =>
                    prev.map((blog) => (blog._id === currentBlogId ? updatedBlog.blog : blog))
                );
                toast.success('Blog updated successfully');
            } else {
                const createdBlog = await createBlog(blogData);
                setBlogs((prev) => [createdBlog.blog, ...prev]); // Add new blog at the first index
                toast.success('Blog created successfully');
            }
            handleClose();
        } catch (error) {
            console.error('Error saving blog:', error); // Debug: Log the error
            toast.error(error.message || 'Failed to save blog');
        }
    };

    const handleDeleteBlog = async (id) => {
        try {
            await deleteBlog(id);
            setBlogs((prev) => prev.filter((blog) => blog._id !== id));
            toast.success('Blog deleted successfully');
        } catch (error) {
            toast.error(error.message || 'Failed to delete blog');
        }
    };

    const handleImageError = (blogId) => {
        setBlogs((prev) =>
            prev.map((blog) =>
                blog._id === blogId ? { ...blog, image: 'https://via.placeholder.com/300x200' } : blog
            )
        );
    };

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
    };

    return (
        <div style={{ padding: '20px' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5">My Blogs</Typography>
                <Box display="flex" gap={1}>
                   
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpen()}
                        sx={{
                            borderRadius: '25px',
                            backgroundColor: '#6d28d9',
                            '&:hover': { backgroundColor: '#5b21b6' },
                        }}
                    >
                        Add
                    </Button>
                </Box>
            </Box>

            {blogs.length === 0 ? (
                <Typography variant="h6" color="text.secondary" textAlign="center">
                    You haven't added any blogs yet.
                </Typography>
            ) : (
                <Grid container spacing={2}>
                    {blogs.map((blog) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={blog._id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={
                                        blog.image.startsWith('http')
                                            ? blog.image
                                            : `${process.env.REACT_APP_API_URL}${blog.image}`
                                    }
                                    alt={blog.title}
                                    sx={{ objectFit: 'cover' }}
                                    onError={() => handleImageError(blog._id)}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {blog.author.name || blog.author} •{' '}
                                        {new Date(blog.createdAt).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="h6" component="div" gutterBottom>
                                        {blog.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {blog.description}
                                    </Typography>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                                        <Chip
                                            label={blog.category.name}
                                            sx={{
                                                backgroundColor:
                                                    blog.category.name === 'Design'
                                                        ? '#6d28d9'
                                                        : blog.category.name === 'Software Development'
                                                            ? '#10b981'
                                                            : blog.category.name === 'Podcasts'
                                                                ? '#f97316'
                                                                : '#3b82f6',
                                                color: 'white',
                                            }}
                                        />
                                        <Box>
                                            <IconButton size="small" onClick={() => handleOpen(blog)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton size="small" onClick={() => handleDeleteBlog(blog._id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                            <IconButton size="small" onClick={() => navigate(`/blog/${blog._id}`)}>
                                                <ArrowForwardIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" mb={2}>
                        {editMode ? 'Edit Blog' : 'Add New Blog'}
                    </Typography>
                    <TextField
                        fullWidth
                        label="Title"
                        name="title"
                        value={newBlog.title}
                        onChange={handleInputChange}
                        margin="normal"
                        required
                        error={!newBlog.title && editMode}
                        helperText={!newBlog.title && editMode ? 'Title is required' : ''}
                    />
                    <TextField
                        fullWidth
                        label="Author"
                        name="author"
                        value={newBlog.author}
                        onChange={handleInputChange}
                        margin="normal"
                        required
                        InputProps={{ readOnly: true }}
                        error={!newBlog.author && editMode}
                        helperText={!newBlog.author && editMode ? 'Author is required' : ''}
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={newBlog.description}
                        onChange={handleInputChange}
                        margin="normal"
                        multiline
                        rows={3}
                        required
                        error={!newBlog.description && editMode}
                        helperText={!newBlog.description && editMode ? 'Description is required' : ''}
                    />
                    <Select
                        fullWidth
                        label="Category"
                        name="category"
                        value={newBlog.category}
                        onChange={handleInputChange}
                        margin="normal"
                        required
                        error={!newBlog.category && editMode}
                        displayEmpty
                        renderValue={(selected) => {
                            if (!selected) return <em>Select a category</em>;
                            const cat = categories.find((c) => c._id === selected);
                            return cat ? cat.name : '';
                        }}
                    >
                        {categories.map((category) => (
                            <MenuItem key={category._id} value={category._id}>
                                {category.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <Button
                        variant="contained"
                        component="label"
                        fullWidth
                        sx={{
                            mt: 2,
                            mb: 2,
                            borderRadius: '25px',
                            backgroundColor: '#6d28d9',
                            '&:hover': { backgroundColor: '#5b21b6' },
                        }}
                    >
                        Upload Image
                        <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                    </Button>
                    {newBlog.image instanceof File && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Selected file: {newBlog.image.name}
                        </Typography>
                    )}
                    <Box display="flex" gap={2} mt={2}>
                        <Button
                            variant="contained"
                            onClick={handleAddOrUpdateBlog}
                            fullWidth
                            sx={{
                                borderRadius: '25px',
                                backgroundColor: '#6d28d9',
                                '&:hover': { backgroundColor: '#5b21b6' },
                            }}
                        >
                            {editMode ? 'Update Blog' : 'Add Blog'}
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleClose}
                            fullWidth
                            sx={{ borderRadius: '25px' }}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default MyBlogs;