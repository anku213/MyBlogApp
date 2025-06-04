import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Add useLocation
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route
  const userData = localStorage.getItem("user");
  const parsedUserData = userData ? JSON.parse(userData) : {};
  const [isScrolled, setIsScrolled] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const isDashboard = ["/dashboard", "/home", "/"].includes(location.pathname);

  useEffect(() => {
    if (isDashboard) {
      const handleScroll = () => {
        const scrolled = window.scrollY > 300;
        setIsScrolled(scrolled);
      };

      window.addEventListener("scroll", handleScroll);

      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isDashboard]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    handleMenuClose();
  };

  const handleMyProfile = () => {
    navigate("/myprofile");
    handleMenuClose();
  };

  const handleCategories = () => {
    navigate("/categories");
    handleMenuClose();
  };

  const handleMyBlogs = () => {
    navigate("/my-blogs");
    handleMenuClose();
  };

  const handleStudyMaterial = () => {
    navigate("/study-material");
    handleMenuClose();
  };

  // Determine background color based on route
  // const isDashboard = ['/dashboard', '/home', '/'].includes(location.pathname);
  const backgroundColor = isDashboard
    ? isScrolled
      ? "rgba(0, 0, 0, 0.87)" // Black when scrolled on /dashboard
      : "transparent" // Transparent when not scrolled on /dashboard
    : "rgba(0, 0, 0, 0.87)"; // Black on all other routes

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: backgroundColor,
        boxShadow: isDashboard && !isScrolled ? "none" : undefined, // No shadow when transparent on /dashboard
        transition: "background-color 0.3s ease-in-out",
        py: 1, // Add vertical padding for better spacing
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            onClick={() => navigate("/dashboard")}
            sx={{
              flexGrow: 1,
              cursor: "pointer",
              fontWeight: "bold",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            MyBlogApp
          </Typography>
          {parsedUserData?.userId ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="body1"
                sx={{
                  color: "inherit",
                  fontWeight: "medium",
                  textTransform: "capitalize",
                }}
              >
                {parsedUserData.name}
              </Typography>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="account menu"
                aria-controls="account-menu"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                sx={{
                  p: 0.5, // Reduce padding for better alignment
                }}
              >
                <AccountCircleIcon sx={{ fontSize: 32 }} />
              </IconButton>
              <Menu
                id="account-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                MenuListProps={{
                  "aria-labelledby": "account-button",
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                sx={{
                  "& .MuiPaper-root": {
                    borderRadius: 2,
                    minWidth: 150,
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    mt: 1,
                  },
                }}
              >
                <MenuItem
                  onClick={handleMyProfile}
                  sx={{ py: 1, fontSize: "0.9rem" }}
                >
                  My Profile
                </MenuItem>
                <MenuItem
                  onClick={handleStudyMaterial}
                  sx={{ py: 1, fontSize: "0.9rem" }}
                >
                  Study Material
                </MenuItem>
                <MenuItem
                  onClick={handleMyBlogs}
                  sx={{ py: 1, fontSize: "0.9rem" }}
                >
                  My Blogs
                </MenuItem>
                <MenuItem
                  onClick={handleCategories}
                  sx={{ py: 1, fontSize: "0.9rem" }}
                >
                  Categories
                </MenuItem>
                <MenuItem
                  onClick={handleLogout}
                  sx={{ py: 1, fontSize: "0.9rem", color: "error.main" }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button
              onClick={() => navigate("/login")}
              variant="outlined"
              sx={{
                borderColor: "white",
                color: "white",
                textTransform: "none",
                borderRadius: "20px",
                px: 3,
                py: 0.5,
                fontWeight: "medium",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderColor: "white",
                },
              }}
            >
              Sign In
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
