import React, { useState, useEffect, useCallback } from 'react';
import {
    Grid,
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
    Pagination,
    Skeleton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';
import {
    createBlog,
    getAllBlogs,
    updateBlog,
    deleteBlog,
} from '../../Api/blogsApi';
import { getAllCategories } from '../../Api/categoriesApi';
import { useNavigate } from 'react-router-dom';

const Blogs = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentBlogId, setCurrentBlogId] = useState(null);
    const [loading, setLoading] = useState(false); // New loading state
    const userData = localStorage.getItem('user');
    const parsedUserData = userData ? JSON.parse(userData) : { name: '', userId: '' };
    const [newBlog, setNewBlog] = useState({
        title: '',
        author: parsedUserData.name,
        description: '',
        category: '',
        image: null,
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalBlogs, setTotalBlogs] = useState(0);

    useEffect(() => {
        fetchBlogs();
        fetchCategories();
    }, []);

    const fetchBlogs = async (search = '', page = 1) => {
        setLoading(true); // Start loading
        try {
            const response = await getAllBlogs({ search, page });
            setBlogs(response.blogs || []);
            setTotalPages(response.totalPages || 1);
            setCurrentPage(response.currentPage || 1);
            setTotalBlogs(response.totalBlogs || 0);
        } catch (error) {
            toast.error(error.message || 'Failed to fetch blogs');
        } finally {
            setLoading(false); // Stop loading regardless of success or failure
        }
    };

    const debouncedFetchBlogs = useCallback(
        debounce((search) => {
            setSearchTerm(search);
            fetchBlogs(search, 1);
        }, 1000),
        []
    );

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedFetchBlogs(value);
        setCurrentPage(1);
    };

    const handleResetSearch = () => {
        setSearchTerm('');
        fetchBlogs('', 1);
        setCurrentPage(1);
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        fetchBlogs(searchTerm, value);
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
                author: blog.author?.name || parsedUserData?.name,
                description: blog.description,
                category: blog.category._id,
                image: null,
            });
        } else {
            setEditMode(false);
            setNewBlog({
                title: '',
                author: parsedUserData.name,
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
            if (!newBlog.title || !newBlog.description || !newBlog.category) {
                toast.error('All required fields must be filled');
                return;
            }

            const blogData = {
                title: newBlog.title,
                description: newBlog.description,
                category: newBlog.category,
                image: newBlog.image,
                author: parsedUserData.userId,
            };

            if (editMode) {
                const updatedBlog = await updateBlog(currentBlogId, blogData);
                setBlogs((prev) =>
                    prev.map((blog) => (blog._id === currentBlogId ? updatedBlog.blog : blog))
                );
                toast.success('Blog updated successfully');
            } else {
                const createdBlog = await createBlog(blogData);
                setBlogs((prev) => [createdBlog.blog, ...prev]);
                toast.success('Blog created successfully');
            }
            handleClose();
            fetchBlogs(searchTerm, currentPage);
        } catch (error) {
            toast.error(error.message || 'Failed to save blog');
        }
    };

    const handleDeleteBlog = async (id) => {
        try {
            await deleteBlog(id);
            setBlogs((prev) => prev.filter((blog) => blog._id !== id));
            toast.success('Blog deleted successfully');
            const totalBlogsAfterDelete = totalBlogs - 1;
            const newTotalPages = Math.ceil(totalBlogsAfterDelete / 6);
            if (blogs.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
                fetchBlogs(searchTerm, currentPage - 1);
            } else {
                fetchBlogs(searchTerm, currentPage);
            }
            setTotalBlogs(totalBlogsAfterDelete);
            setTotalPages(newTotalPages);
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
        width: { xs: '90%', sm: 400 },
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        maxHeight: '90vh',
        overflowY: 'auto',
    };

    return (
        <Box sx={{ padding: { xs: '10px', sm: '20px' } }}>
            {/* Header Section */}
            <Box
                display="flex"
                flexDirection={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                mb={3}
                gap={{ xs: 2, sm: 0 }}
            >
                <Typography variant="h5">Blogs</Typography>
                <Box display="flex" flexDirection={{ xs: 'row', sm: 'row' }} gap={1} width={{ xs: '100%', sm: 'auto' }}>
                    <TextField
                        variant="outlined"
                        placeholder="Search..."
                        size="small"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            flexGrow: { xs: 1, sm: 0 },
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '25px',
                            },
                        }}
                    />
                    {searchTerm && (
                        <Button
                            variant="outlined"
                            onClick={handleResetSearch}
                            sx={{
                                borderRadius: '25px',
                                borderColor: '#6d28d9',
                                color: '#6d28d9',
                                '&:hover': {
                                    borderColor: '#5b21b6',
                                    color: '#5b21b6',
                                },
                                minWidth: '40px',
                                padding: { xs: '6px', sm: '8px' },
                            }}
                        >
                            <ClearIcon />
                        </Button>
                    )}
                    {parsedUserData?.userId &&
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpen()}
                            sx={{
                                backgroundColor: '#6d28d9',
                                '&:hover': { backgroundColor: '#5b21b6' },
                                borderRadius: '25px',
                                padding: { xs: '6px 12px', sm: '8px 16px' },
                            }}
                        >
                            Add
                        </Button>
                    }

                </Box>
            </Box>

            {/* Blog Grid with Skeleton Loader */}
            <Grid container spacing={2} justifyContent={{ xs: 'center', sm: 'flex-start' }}>
                {loading ? (
                    Array.from(new Array(6)).map((_, index) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            key={index}
                        >
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    paddingLeft: { xs: '10px', sm: '30px' },
                                    width: '100%',
                                    boxSizing: 'border-box',
                                }}
                            >
                                <Skeleton variant="rectangular" height={200} />
                                <CardContent>
                                    <Skeleton variant="text" height={30} />
                                    <Skeleton variant="text" height={20} />
                                    <Skeleton variant="text" height={60} />
                                    <Box display="flex" justifyContent="space-between" mt={2}>
                                        <Skeleton variant="rectangular" width={100} height={30} />
                                        <Box display="flex" gap={0.5}>
                                            <Skeleton variant="circular" width={30} height={30} />
                                            <Skeleton variant="circular" width={30} height={30} />
                                            <Skeleton variant="circular" width={30} height={30} />
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : blogs.length > 0 ? (
                    blogs.map((blog) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            key={blog._id}
                        >
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    paddingLeft: { xs: '10px', sm: '30px' },
                                    width: '100%',
                                    boxSizing: 'border-box',
                                }}
                            >
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
                                        {blog.author?.name || blog.author} • {new Date(blog?.createdAt).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="h6" component="div" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                                        {blog.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                                        {blog.description}
                                    </Typography>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                                        <Chip
                                            label={blog.category?.name}
                                            sx={{
                                                backgroundColor:
                                                    blog.category?.name === 'Design'
                                                        ? '#6d28d9'
                                                        : blog.category?.name === 'Software Development'
                                                            ? '#10b981'
                                                            : blog.category?.name === 'Podcasts'
                                                                ? '#f97316'
                                                                : '#3b82f6',
                                                color: 'white',
                                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                            }}
                                        />
                                        <Box display="flex" gap={0.5}>
                                            <IconButton size="small" onClick={() => navigate(`/blog/${blog._id}`)}>
                                                <ArrowForwardIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Box width="100%" textAlign="center" mt={4}>
                        <Typography variant="h6" color="text.secondary">
                            No blogs found
                        </Typography>
                    </Box>
                )}
            </Grid>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={4}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        size="medium"
                        sx={{
                            '& .MuiPaginationItem-root': {
                                color: '#6d28d9',
                                fontSize: { xs: '0.875rem', sm: '1rem' },
                            },
                            '& .Mui-selected': {
                                backgroundColor: '#6d28d9',
                                color: 'white',
                            },
                            '& .MuiPaginationItem-root:hover': {
                                backgroundColor: '#5b21b6',
                                color: 'white',
                            },
                        }}
                    />
                </Box>
            )}

            {/* Modal for Add/Edit Blog */}
            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" mb={2} sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
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
                        sx={{ '& .MuiInputBase-input': { fontSize: { xs: '0.875rem', sm: '1rem' } } }}
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
                        sx={{ '& .MuiInputBase-input': { fontSize: { xs: '0.875rem', sm: '1rem' } } }}
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
                        sx={{ '& .MuiInputBase-input': { fontSize: { xs: '0.875rem', sm: '1rem' } } }}
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
                        sx={{ '& .MuiSelect-select': { fontSize: { xs: '0.875rem', sm: '1rem' } } }}
                    >
                        {categories.map((category) => (
                            <MenuItem key={category._id} value={category._id} sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
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
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                            padding: { xs: '8px', sm: '10px' },
                        }}
                    >
                        Upload Image
                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </Button>
                    {newBlog.image instanceof File && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
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
                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                padding: { xs: '8px', sm: '10px' },
                            }}
                        >
                            {editMode ? 'Update Blog' : 'Add Blog'}
                        </Button>
                        <Button
                            sx={{
                                borderRadius: '25px',
                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                padding: { xs: '8px', sm: '10px' },
                            }}
                            variant="outlined"
                            onClick={handleClose}
                            fullWidth
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default Blogs;