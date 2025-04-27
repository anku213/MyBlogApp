import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from 'react-toastify';
import { getBlogById } from '../../Api/blogsApi';

const BlogDetail = () => {
  const { id } = useParams(); // Get blog ID from URL
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    fetchBlogDetails();
    // eslint-disable-next-line
  }, [id]);

  const fetchBlogDetails = async () => {
    try {
      const fetchedBlog = await getBlogById(id);
      setBlog(fetchedBlog);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch blog details');
    }
  };

  if (!blog) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ padding: '20px' }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 2 }}
      >
        Back to Blogs
      </Button>

      <Card
        sx={{
          maxWidth: 800,
          margin: '0 auto',
          borderRadius: 2,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        }}
      >
        <CardMedia
          component="img"
          height="400"
          image={
            blog.image.startsWith('http')
              ? blog.image
              : `${process.env.REACT_APP_API_URL}${blog.image}`
          }
          alt={blog.title}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            {blog.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            By {blog.author?.name || blog.author || 'Unknown Author'} |{' '}
            {new Date(blog.createdAt).toLocaleDateString()}
          </Typography>
          <Typography variant="body1" paragraph>
            {blog.description}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Category: {blog.category?.name || 'Uncategorized'}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BlogDetail;