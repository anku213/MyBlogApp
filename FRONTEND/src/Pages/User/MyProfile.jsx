import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    TextField,
    Button,
    Card,
    CardMedia,
    CardContent,
    IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { toast } from 'react-toastify';
import { getProfile, updateProfile } from '../../Api/userApi'; // Adjust path as needed

const MyProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        image: null,
    });
    const [editMode, setEditMode] = useState(false);
    const [newProfile, setNewProfile] = useState({
        name: '',
        email: '',
        image: null,
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const fetchedProfile = await getProfile();
            setProfile(fetchedProfile);
            setNewProfile({
                name: fetchedProfile.name,
                email: fetchedProfile.email,
                image: null,
            });
        } catch (error) {
            toast.error(error.message || 'Failed to fetch profile');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setNewProfile((prev) => ({ ...prev, image: file }));
    };

    const handleSaveProfile = async () => {
        try {
            if (!newProfile.name || !newProfile.email) {
                toast.error('Name and email are required');
                return;
            }

            const formData = new FormData();
            formData.append('name', newProfile.name);
            formData.append('email', newProfile.email);
            if (newProfile.image) {
                formData.append('image', newProfile.image);
            }

            const updatedProfile = await updateProfile(formData);
            setProfile(updatedProfile);
            setEditMode(false);
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error(error.message || 'Failed to update profile');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/')}
                sx={{ mb: 2 }}
            >
                Back to Blogs
            </Button>

            <Card sx={{ maxWidth: 600, margin: '0 auto' }}>
                <CardMedia
                    component="img"
                    height="300"
                    image={
                        profile.image && !profile.image.startsWith('http')
                            ? `${process.env.REACT_APP_API_URL}${profile.image}`
                            : profile.image || 'https://via.placeholder.com/300x300'
                    }
                    alt={profile.name || 'Profile'}
                    sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                    <Typography variant="h4" component="h1" gutterBottom>
                        My Profile
                    </Typography>
                    {editMode ? (
                        <>
                            <TextField
                                fullWidth
                                label="Name"
                                name="name"
                                value={newProfile.name}
                                onChange={handleInputChange}
                                margin="normal"
                                required
                                error={!newProfile.name}
                                helperText={!newProfile.name ? 'Name is required' : ''}
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                value={newProfile.email}
                                onChange={handleInputChange}
                                margin="normal"
                                required
                                error={!newProfile.email}
                                helperText={!newProfile.email ? 'Email is required' : ''}
                            />
                            <Button
                                variant="contained"
                                component="label"
                                fullWidth
                                sx={{ mt: 2, mb: 2 }}
                            >
                                Upload Profile Picture
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </Button>
                            {newProfile.image instanceof File && (
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Selected file: {newProfile.image.name}
                                </Typography>
                            )}
                            <Box display="flex" gap={2}>
                                <Button
                                    variant="contained"
                                    onClick={handleSaveProfile}
                                    fullWidth
                                >
                                    Save
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => setEditMode(false)}
                                    fullWidth
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <>
                            <Typography variant="h6" gutterBottom>
                                Name: {profile.name}
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                Email: {profile.email}
                            </Typography>
                            <IconButton
                                size="large"
                                onClick={() => setEditMode(true)}
                                sx={{ mt: 2 }}
                            >
                                <EditIcon />
                            </IconButton>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default MyProfile;