import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  List,
  Card,
  CardContent,
  Container,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
  Avatar,
  InputAdornment,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Add,
  Folder,
  LibraryBooks,
  Quiz,
  ExpandMore,
  Help,
  Create,
  Check,
  Delete,
  ArrowBack,
} from "@mui/icons-material";
import {
  getQuestionCategoriesByUser,
  getQuestionsByUserAndCategory,
  addQuestion,
  deleteQuestion,
} from "../../Api/studyMaterialApi";
import { useNavigate, useParams } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const CategoryQuestions = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const userData = localStorage.getItem("user");
  const parsedUserData = userData ? JSON.parse(userData) : {};
  const userId = parsedUserData?.userId;

  const [category, setCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [showAddQuestion, setShowAddQuestion] = useState(false);

  useEffect(() => {
    fetchCategory();
    fetchQuestions();
  }, [categoryId]);

  const fetchCategory = async () => {
    setLoading(true);
    try {
      const data = await getQuestionCategoriesByUser(userId);
      const selected = data.find((cat) => cat._id === categoryId);
      setCategory(selected);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to fetch category",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const data = await getQuestionsByUserAndCategory(userId, categoryId);
      setQuestions(data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to fetch questions",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async () => {
    if (!question.trim() || !answer.trim()) {
      setSnackbar({
        open: true,
        message: "Please fill all fields",
        severity: "warning",
      });
      return;
    }
    setLoading(true);
    try {
      await addQuestion(userId, categoryId, question, answer);
      setQuestion("");
      setAnswer("");
      await fetchQuestions();
      setSnackbar({
        open: true,
        message: "Question added successfully!",
        severity: "success",
      });
      setShowAddQuestion(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to add question",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (id) => {
    setLoading(true);
    try {
      await deleteQuestion(id);
      await fetchQuestions();
      setSnackbar({
        open: true,
        message: "Question deleted",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete question",
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
            <Box display="flex" alignItems="center" gap={2}>
              <IconButton
                onClick={() => navigate("/study-material")}
                sx={{ color: "white" }}
              >
                <ArrowBack />
              </IconButton>
              <Box>
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  sx={{ fontSize: { xs: "2rem", md: "3rem" } }}
                  className="text-white"
                >
                  {category ? category.name : "Loading..."}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ opacity: 0.9, fontSize: { xs: "1rem", md: "1.25rem" } }}
                  className="text-blue-100"
                >
                  Study Questions
                </Typography>
              </Box>
            </Box>
            <Chip
              icon={<Quiz className="text-white" />}
              label={`${questions.length} Questions`}
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
        {!showAddQuestion && (
          <Box display="flex" justifyContent="flex-end" mb={3}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowAddQuestion(true)}
              sx={{
                bgcolor: "#f59e0b",
                "&:hover": { bgcolor: "#d97706" },
                borderRadius: 2,
                fontSize: { xs: "0.9rem", md: "1rem" },
                fontWeight: "bold",
                py: 1.5,
                px: 3,
              }}
              className="transition-all duration-300"
            >
              Add New Question
            </Button>
          </Box>
        )}

        {showAddQuestion && (
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: "0 6px 24px rgba(0,0,0,0.15)",
              bgcolor: "#fefce8",
              mb: 4,
              border: "1px solid #f59e0b",
            }}
            className="transition-all duration-300 hover:shadow-2xl"
          >
            <CardContent sx={{ p: { xs: 4, md: 6 } }}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={4}
              >
                <Box display="flex" alignItems="center">
                  <Avatar
                    sx={{
                      bgcolor: "#f59e0b",
                      mr: 2,
                      width: 48,
                      height: 48,
                    }}
                  >
                    <Create sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}
                    >
                      Add Question
                    </Typography>
                    <Typography
                      color="text.secondary"
                      sx={{ fontSize: { xs: "1rem", md: "1.125rem" } }}
                    >
                      to "{category?.name}"
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  onClick={() => setShowAddQuestion(false)}
                  sx={{
                    borderColor: "#ef4444",
                    color: "#ef4444",
                    "&:hover": { borderColor: "#dc2626", color: "#dc2626" },
                    borderRadius: 2,
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    px: 3,
                  }}
                >
                  Cancel
                </Button>
              </Box>
              <Box component="form" sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  label="Question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  multiline
                  rows={4}
                  placeholder="Enter your question here..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{ alignSelf: "flex-start", mt: 1.5 }}
                      >
                        <Help sx={{ color: "#1e3a8a", fontSize: 28 }} />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  sx={{ bgcolor: "white", borderRadius: 2, mb: 4 }}
                  className="rounded-lg"
                />
                <Box sx={{ mb: 4, bgcolor: "white", borderRadius: 2, p: 2 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 1, fontWeight: "medium", color: "#1f2937" }}
                  >
                    Answer
                  </Typography>
                  <CKEditor
                    editor={ClassicEditor}
                    data={answer}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setAnswer(data);
                    }}
                    config={{
                      placeholder: "Enter the answer here...",
                      toolbar: [
                        "heading",
                        "|",
                        "bold",
                        "italic",
                        "link",
                        "bulletedList",
                        "numberedList",
                        "|",
                        "undo",
                        "redo",
                      ],
                    }}
                  />
                </Box>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleAddQuestion}
                  disabled={loading}
                  sx={{
                    py: 2,
                    bgcolor: "#f59e0b",
                    "&:hover": { bgcolor: "#d97706" },
                    borderRadius: 2,
                    fontSize: { xs: "1rem", md: "1.125rem" },
                    fontWeight: "bold",
                  }}
                  className="transition-all duration-300"
                >
                  {loading ? (
                    <CircularProgress size={28} color="inherit" />
                  ) : (
                    "Add Question"
                  )}
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        <Card
          sx={{
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            bgcolor: "white",
          }}
          className="transition-all duration-300 hover:shadow-xl"
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={3}
            >
              <Box display="flex" alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: "#8b5cf6",
                    mr: 2,
                    width: 48,
                    height: 48,
                  }}
                >
                  <Quiz sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}
                  >
                    Questions
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
                  >
                    {category?.name} • {questions.length} questions
                  </Typography>
                </Box>
              </Box>
            </Box>
            {loading ? (
              <Box display="flex" justifyContent="center" py={8}>
                <CircularProgress />
              </Box>
            ) : questions.length === 0 ? (
              <Box textAlign="center" py={8}>
                <Quiz
                  sx={{
                    fontSize: { xs: 60, md: 80 },
                    color: "#9ca3af",
                    mb: 2,
                  }}
                />
                <Typography
                  variant="h6"
                  color="text.secondary"
                  mb={2}
                  sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
                >
                  No questions yet
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
                >
                  Add your first question using the button above!
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  maxHeight: { xs: "auto", md: 600 },
                  overflowY: "auto",
                }}
              >
                {questions.map((q, index) => (
                  <Accordion
                    key={q._id}
                    sx={{
                      mb: 2,
                      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                    className="transition-all duration-300"
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      sx={{
                        bgcolor: "#f9fafb",
                        "&:hover": { bgcolor: "#f1f5f9" },
                        p: 2,
                      }}
                    >
                      <Box display="flex" alignItems="center" width="100%">
                        <Chip
                          label={`Q${index + 1}`}
                          size="small"
                          sx={{
                            mr: 2,
                            bgcolor: "#8b5cf6",
                            color: "white",
                          }}
                        />
                        <Typography
                          variant="h6"
                          sx={{
                            flexGrow: 1,
                            fontSize: { xs: "0.9rem", md: "1rem" },
                            color: "#1f2937",
                          }}
                        >
                          {q.question}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteQuestion(q._id);
                          }}
                          sx={{ ml: 1 }}
                        >
                          <Delete sx={{ color: "#ef4444" }} />
                        </IconButton>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ bgcolor: "white", pt: 3, pb: 2 }}>
                      <Box display="flex" alignItems="flex-start">
                        <Check sx={{ color: "#22c55e", mr: 2, mt: 0.5 }} />
                        <Typography
                          variant="body1"
                          sx={{
                            lineHeight: 1.6,
                            fontSize: { xs: "0.9rem", md: "1rem" },
                          }}
                          dangerouslySetInnerHTML={{ __html: q.answer }}
                        />
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
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

export default CategoryQuestions;