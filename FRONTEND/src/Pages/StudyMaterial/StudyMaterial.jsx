import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  Card,
  CardContent,
  Container,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
  Avatar,
  InputAdornment,
} from "@mui/material";
import { Add, Folder, LibraryBooks } from "@mui/icons-material";
import {
  getQuestionCategoriesByUser,
  addCategory,
  getQuestionsByUserAndCategory,
} from "../../Api/studyMaterialApi";
import { useNavigate } from "react-router-dom";

const StudyMaterial = () => {
  const userData = localStorage.getItem("user");
  const parsedUserData = userData ? JSON.parse(userData) : {};
  const userId = parsedUserData?.userId;
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [questionCounts, setQuestionCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getQuestionCategoriesByUser(userId);
      setCategories(data);
      await fetchQuestionCounts(data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to fetch categories",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestionCounts = async (categories) => {
    try {
      const counts = {};
      for (const cat of categories) {
        const questions = await getQuestionsByUserAndCategory(userId, cat._id);
        counts[cat._id] = questions.length;
      }
      setQuestionCounts(counts);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to fetch question counts",
        severity: "error",
      });
    }
  };

  const handleAddCategory = async () => {
    if (!category.trim()) {
      setSnackbar({
        open: true,
        message: "Please enter a category name",
        severity: "warning",
      });
      return;
    }
    setLoading(true);
    try {
      await addCategory(userId, category);
      setCategory("");
      await fetchCategories();
      setSnackbar({
        open: true,
        message: "Category added successfully!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to add category",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      sx={{ minHeight: "100vh", bgcolor: "background.default" }}
      className="bg-gray-100"
    >
      <Box
        sx={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
          color: "white",
          py: { xs: 4, md: 6 },
          mb: 4,
        }}
      >
        <Container maxWidth="lg">
          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            gap={2}
          >
            <Box>
              <Typography
                variant="h3"
                fontWeight="bold"
                mb={1}
                sx={{ fontSize: { xs: "2rem", md: "3rem" } }}
                className="text-white"
              >
                📚 Study Material Hub
              </Typography>
              <Typography
                variant="h6"
                sx={{ opacity: 0.9, fontSize: { xs: "1rem", md: "1.25rem" } }}
                className="text-blue-100"
              >
                Organize, Learn, and Excel in Your Studies
              </Typography>
            </Box>
            <Chip
              icon={<LibraryBooks className="text-white" />}
              label={`${categories.length} Categories`}
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                color: "white",
                fontSize: { xs: "0.8rem", md: "1rem" },
              }}
              className="backdrop-blur-sm"
            />
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
          }}
        >
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              bgcolor: "white",
            }}
            className="transition-all duration-300 hover:shadow-xl"
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar sx={{ bgcolor: "#22c55e", mr: 2 }}>
                  <Add />
                </Avatar>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}
                >
                  Create New Category
                </Typography>
              </Box>
              <TextField
                fullWidth
                label="Category Name"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., ReactJS, NodeJS, Machine Learning"
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Folder sx={{ color: "#1e3a8a" }} />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                className="rounded-lg"
              />
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleAddCategory}
                disabled={loading}
                sx={{
                  py: 1.5,
                  bgcolor: "#22c55e",
                  "&:hover": { bgcolor: "#16a34a" },
                  borderRadius: 2,
                  fontSize: { xs: "0.9rem", md: "1rem" },
                  fontWeight: "bold",
                }}
                className="transition-all duration-300"
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Create Category"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              bgcolor: "white",
              height: { xs: "auto", md: 500 },
            }}
            className="transition-all duration-300 hover:shadow-xl"
          >
            <CardContent sx={{ p: { xs: 3, md: 4 }, height: "100%" }}>
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar sx={{ bgcolor: "#3b82f6", mr: 2 }}>
                  <LibraryBooks />
                </Avatar>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}
                >
                  Your Categories
                </Typography>
              </Box>
              <Box sx={{ height: { xs: "auto", md: 350 }, overflowY: "auto" }}>
                {loading ? (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="100%"
                  >
                    <CircularProgress />
                  </Box>
                ) : categories.length === 0 ? (
                  <Box textAlign="center" py={8}>
                    <Typography variant="h6" color="text.secondary" mb={2}>
                      No categories yet
                    </Typography>
                    <Typography color="text.secondary">
                      Create your first category to get started!
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {categories.map((cat, index) => (
                      <ListItem key={cat._id} sx={{ px: 0, py: 0.5 }}>
                        <Box
                          sx={{
                            width: "100%",
                            p: 2,
                            cursor: "pointer",
                            transition: "all 0.3s",
                            "&:hover": {
                              bgcolor: "#eff6ff",
                              transform: "translateX(4px)",
                            },
                            bgcolor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: 2,
                          }}
                          onClick={() => navigate(`/study-material/${cat._id}`)}
                          className="transition-all duration-300"
                        >
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Box display="flex" alignItems="center">
                              <Folder sx={{ mr: 2, color: "#1e3a8a" }} />
                              <Typography
                                variant="h6"
                                fontWeight="medium"
                                sx={{
                                  fontSize: { xs: "1rem", md: "1.125rem" },
                                }}
                              >
                                {cat.name}
                              </Typography>
                            </Box>
                            <Box display="flex" gap={1}>
                              <Chip
                                size="small"
                                label={`${questionCounts[cat._id] || 0}`}
                                sx={{ bgcolor: "#3b82f6", color: "white" }}
                              />
                            </Box>
                          </Box>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudyMaterial;
