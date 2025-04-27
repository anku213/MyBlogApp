import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import Header from '../Pages/Dashboard/Header';
import Footer from '../Pages/Dashboard/Footer';

const Layout = ({ children }) => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <Box
        component="main"
        flexGrow={1}
        sx={{
          py: 3,
          mt: (theme) => ({
            xs: 56, // Mobile height for AppBar (56px)
            sm: 8, // Desktop height for AppBar (64px + 8px + 8px = 80px due to py: 1)
          }),
          minHeight: (theme) => ({
            xs: 'calc(100vh - 56px - 60px)', // Header (56px) + Footer (60px) on mobile
            sm: 'calc(100vh - 80px - 60px)', // Header (80px) + Footer (60px) on desktop
          }),
        }}
      >
        {children}
      </Box>

      {/* Footer */}
      <Footer sx={{ mt: 'auto' }} />
    </Box>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;