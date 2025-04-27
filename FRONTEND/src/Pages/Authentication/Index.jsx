import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import Login from './Login';
import Register from './Register';

const Index = () => {
  const location = useLocation();

  const renderPage = () => {
    switch (location.pathname) {
      case '/login':
        return <Login />;
      case '/register':
        return <Register />;
      default:
        return <Login />;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        height: '96vh', // Full viewport height
        backgroundColor: '#fff',
        overflow: 'hidden', // Prevent scrolling
      }}
    >
      {/* Left Side: Login/Register Form */}
      <Box
        sx={{
          flex: { xs: 1, md: 1 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: { xs: 3, md: 5 },
          height: { xs: '50vh', md: '90vh' }, // Adjust height to fit viewport
          order: { xs: 2, md: 1 },
          overflow: 'hidden', // Prevent form from causing scroll
        }}
      >
        {renderPage()}
      </Box>

      {/* Right Side: Background Image */}
      <Box
        sx={{
          flex: { xs: 1, md: 1 },
          height: { xs: '50vh', md: '91vh' }, // Adjust height to fit viewport
          backgroundImage: 'url("https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG5hdHVyZXxlbnwwfHwwfHx8MA%3D%3D")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: { xs: '20px 20px 20px 20px', md: '20px 20px' },
          order: { xs: 1, md: 2 },
        //   padding: { xs: 2, md: 3 }, // Add padding around the image
          margin: { xs: '30px 10px 10px 10px', md: '30px 20px 10px 10px' }, // Add margin to create space around the image
          boxSizing: 'border-box', // Ensure padding doesn't increase size
          overflow: 'hidden', // Prevent image from causing scroll
        }}
      />
    </Box>
  );
};

export default Index;