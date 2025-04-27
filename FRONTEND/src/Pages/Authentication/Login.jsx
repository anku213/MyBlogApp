import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Box, IconButton, InputAdornment } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { loginUser } from '../../Api/authApi'; // Adjust the path as needed
import { toast } from 'react-toastify';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    // Toggle password visibility
    const handleClickShowPassword = () => setShowPassword((prev) => !prev);

    // Formik setup with validation schema
    const formik = useFormik({
        initialValues: {
            email: 'shalini@gmail.com', 
            password: 'Admin@123',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            password: Yup.string()
                .required('Password is required')
                .min(8, 'Password must be at least 8 characters'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                setSubmitting(true);
                const response = await loginUser({ email: values.email, password: values.password })
                localStorage.setItem('token', response?.token);
                localStorage.setItem('user', response?.data && JSON.stringify(response.data));
                toast.success('Login successful! Redirecting to dashboard...');
                navigate('/dashboard')
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Login failed';
                toast.error(errorMessage);
            } finally {
                setSubmitting(false);
            }
        },
    });

    const onRegisterClick = () => {
        navigate('/register');
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                height: '100%',
                padding: 4,
                maxWidth: '400px', // Limit width like in the screenshot
            }}
        >
            {/* Welcome Message with Emoji */}
            <Typography
                variant="h5"
                sx={{
                    fontWeight: 'bold',
                    mb: 1,
                    color: '#333',
                }}
            >
                Welcome Back 👋
            </Typography>
            <Typography
                variant="body2"
                sx={{
                    color: '#666',
                    mb: 3,
                }}
            >
                Shape Your Thoughts. Sign in to share and explore insightful blogs.
            </Typography>

            {/* Form */}
            <form onSubmit={formik.handleSubmit}>
                {/* Email Field */}
                <Box sx={{ mb: 2 }}>
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                        required
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                                backgroundColor: '#fff',
                            },
                            '& .MuiInputLabel-root': {
                                color: '#666',
                            },
                        }}
                    />
                </Box>

                {/* Password Field */}
                <Box sx={{ mb: 3 }}>
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                        required
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                                backgroundColor: '#fff',
                            },
                            '& .MuiInputLabel-root': {
                                color: '#666',
                            },
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {/* Error Message for Submission */}
                {formik.errors.submit && (
                    <Typography color="error" variant="body2" align="center" sx={{ mb: 2 }}>
                        {formik.errors.submit}
                    </Typography>
                )}

                {/* Sign In Button */}
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={formik.isSubmitting}
                    sx={{
                        backgroundColor: '#6B48FF', // Purple color from the screenshot
                        color: '#fff',
                        borderRadius: '25px', // Rounded button
                        padding: '12px 0',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        mb: 2,
                        '&:hover': {
                            backgroundColor: '#5A3DE6', // Slightly darker purple on hover
                        },
                    }}
                >
                    {formik.isSubmitting ? 'Logging in...' : 'Sign In'}
                </Button>

                {/* Register Link */}
                <Typography
                    variant="body2"
                    align="center"
                    sx={{ color: '#666' }}
                >
                    Don’t have an account?{' '}
                    <Button
                        variant="text"
                        onClick={onRegisterClick}
                        sx={{
                            textTransform: 'none',
                            color: '#6B48FF',
                            fontWeight: 'medium',
                        }}
                    >
                        Sign Up
                    </Button>
                </Typography>
            </form>
        </Box>
    );
};

export default Login;