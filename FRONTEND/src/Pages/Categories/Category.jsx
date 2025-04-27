import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Modal,
    IconButton,
    Paper,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
} from '../../Api/categoriesApi'; // Adjust path as needed

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentCategoryId, setCurrentCategoryId] = useState(null);
    const [newCategory, setNewCategory] = useState({
        name: '',
        description: '',
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const fetchedCategories = await getAllCategories();
            setCategories(fetchedCategories);
        } catch (error) {
            toast.error(error.message || 'Failed to fetch categories');
        }
    };

    const handleOpen = (category = null) => {
        if (category) {
            setEditMode(true);
            setCurrentCategoryId(category._id);
            setNewCategory({
                name: category.name,
                description: category.description || '',
            });
        } else {
            setEditMode(false);
            setNewCategory({ name: '', description: '' });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditMode(false);
        setCurrentCategoryId(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCategory((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddOrUpdateCategory = async () => {
        try {
            if (!newCategory.name) {
                toast.error('Category name is required');
                return;
            }

            if (editMode) {
                const updatedCategory = await updateCategory(currentCategoryId, newCategory);
                setCategories((prev) =>
                    prev.map((cat) => (cat._id === currentCategoryId ? updatedCategory.category : cat))
                );
                toast.success('Category updated successfully');
            } else {
                const createdCategory = await createCategory(newCategory);
                setCategories((prev) => [...prev, createdCategory.category]);
                toast.success('Category created successfully');
            }
            handleClose();
        } catch (error) {
            toast.error(error.message || 'Failed to save category');
        }
    };

    const handleDeleteCategory = async (id) => {
        try {
            await deleteCategory(id);
            setCategories((prev) => prev.filter((cat) => cat._id !== id));
            toast.success('Category deleted successfully');
        } catch (error) {
            toast.error(error.message || 'Failed to delete category');
        }
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
                <Typography variant="h5">Categories</Typography>
                <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpen()}
                    sx={{ borderRadius: '25px', backgroundColor: '#6d28d9', '&:hover': { backgroundColor: '#5b21b6' } }}

                >
                    Add Category
                </Button>
            </Box>

            <Paper elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category._id}>
                                <TableCell>{category.name}</TableCell>
                                <TableCell>{category.description || 'N/A'}</TableCell>
                                <TableCell align="right">
                                    <IconButton size="small" onClick={() => handleOpen(category)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => handleDeleteCategory(category._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" mb={2}>
                        {editMode ? 'Edit Category' : 'Add New Category'}
                    </Typography>
                    <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={newCategory.name}
                        onChange={handleInputChange}
                        margin="normal"
                        required
                        error={!newCategory.name && editMode}
                        helperText={!newCategory.name && editMode ? 'Name is required' : ''}
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={newCategory.description}
                        onChange={handleInputChange}
                        margin="normal"
                        multiline
                        rows={3}
                    />
                    <Box display="flex" gap={2} mt={2}>
                        <Button
                            variant="contained"
                            onClick={handleAddOrUpdateCategory}
                            fullWidth
                            sx={{ borderRadius: '25px', backgroundColor: '#6d28d9', '&:hover': { backgroundColor: '#5b21b6' } }}
                        >
                            {editMode ? 'Update Category' : 'Add Category'}
                        </Button>
                        <Button sx={{ borderRadius: '25px' }} variant="outlined" onClick={handleClose} fullWidth>
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default Category;