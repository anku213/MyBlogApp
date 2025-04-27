import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, TextField, Typography, Box, IconButton, InputAdornment } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from '../../Api/authApi';
import { toast } from 'react-toastify';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Toggle password visibility
  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  // Formik setup with validation schema
  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Full name is required')
        .min(2, 'Name must be at least 2 characters'),
      phone: Yup.string()
        .required('Phone number is required')
        .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const userData = {
          name: values.name,
          email: values.email,
          password: values.password,
        };
        const response = await registerUser(userData);
        localStorage.setItem('token', response.data.token);
        toast.success('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Registration failed';
        toast.error(errorMessage);
        setErrors({ submit: errorMessage });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        padding: { xs: 2, md: 3 }, // Reduced padding
        maxWidth: '400px',
        overflowY: 'auto', // Allow scrolling within the form if needed
      }}
    >
      {/* Sign Up Heading */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 'bold',
          mb: 0.5, // Reduced margin
          color: '#333',
        }}
      >
        Sign Up
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: '#666',
          mb: 2, // Reduced margin
        }}
      >
        Join the conversation. Sign up to share and explore insightful blogs.
      </Typography>

      {/* Form */}
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
        {/* Full Name Field */}
        <Box sx={{ mb: 1.5 }}> {/* Reduced margin */}
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            variant="outlined"
            margin="dense" // Smaller margin for denser layout
            placeholder="Enter full name"
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                backgroundColor: '#fff',
              },
              '& .MuiInputLabel-root': {
                color: '#666',
              },
              '& .MuiInputBase-input': {
                padding: '10px 14px', // Reduced padding for smaller height
              },
            }}
          />
        </Box>

        {/* Phone Number Field */}
        <Box sx={{ mb: 1.5 }}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            variant="outlined"
            margin="dense"
            placeholder="Enter phone number"
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                backgroundColor: '#fff',
              },
              '& .MuiInputLabel-root': {
                color: '#666',
              },
              '& .MuiInputBase-input': {
                padding: '10px 14px',
              },
            }}
          />
        </Box>

        {/* Email Field */}
        <Box sx={{ mb: 1.5 }}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            variant="outlined"
            margin="dense"
            placeholder="Enter email"
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                backgroundColor: '#fff',
              },
              '& .MuiInputLabel-root': {
                color: '#666',
              },
              '& .MuiInputBase-input': {
                padding: '10px 14px',
              },
            }}
          />
        </Box>

        {/* Password Field */}
        <Box sx={{ mb: 1.5 }}>
          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            variant="outlined"
            margin="dense"
            placeholder="Enter password"
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                backgroundColor: '#fff',
              },
              '& .MuiInputLabel-root': {
                color: '#666',
              },
              '& .MuiInputBase-input': {
                padding: '10px 14px',
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Confirm Password Field */}
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            variant="outlined"
            margin="dense"
            placeholder="Confirm password"
            error={
              formik.touched.confirmPassword &&
              Boolean(formik.errors.confirmPassword)
            }
            helperText={
              formik.touched.confirmPassword && formik.errors.confirmPassword
            }
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                backgroundColor: '#fff',
              },
              '& .MuiInputLabel-root': {
                color: '#666',
              },
              '& .MuiInputBase-input': {
                padding: '10px 14px',
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowConfirmPassword} edge="end">
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Error Message for Submission */}
        {formik.errors.submit && (
          <Typography color="error" variant="body2" align="center" sx={{ mb: 1 }}>
            {formik.errors.submit}
          </Typography>
        )}

        {/* Sign Up Button */}
        <Button
          fullWidth
          type="submit"
          variant="contained"
          disabled={formik.isSubmitting}
          sx={{
            backgroundColor: '#6B48FF',
            color: '#fff',
            borderRadius: '25px',
            padding: '10px 0', // Reduced padding
            fontWeight: 'bold',
            textTransform: 'uppercase',
            mb: 1.5, // Reduced margin
            '&:hover': {
              backgroundColor: '#5A3DE6',
            },
          }}
        >
          Sign Up
        </Button>

        {/* Login Link */}
        <Typography variant="body2" align="center" sx={{ color: '#666' }}>
          Already have an account?{' '}
          <Link
            to="/login"
            style={{
              color: '#6B48FF',
              textDecoration: 'none',
              fontWeight: 'medium',
            }}
          >
            Sign In
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Register;