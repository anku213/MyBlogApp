import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import Blogs from '../Blogs/Blogs';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Array of carousel images with additional data
const carouselImages = [
    {
        url: 'https://media.istockphoto.com/id/2147497907/photo/young-woman-traveler-relaxing-and-enjoying-the-tropical-sea-while-traveling-for-summer.webp?s=2048x2048&w=is&k=20&c=iD10fexHda4TXAEcbj_B_D58iGfwvUQ_ZbncfrHTa3o=',
        alt: 'Young woman relaxing by the tropical sea',
        title: 'Tropical Getaway: A Journey to Paradise',
        date: 'April 25, 2025',
        category: 'Travel',
        description: 'Discover the beauty of tropical seas and unwind in paradise with this photorealistic rendering.',
    },
    {
        url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
        alt: 'Sunset over the ocean',
        title: 'Sunset Serenity: Ocean Horizons',
        date: 'April 20, 2025',
        category: 'Nature',
        description: 'Capture the serene beauty of a sunset over the ocean in this stunning photorealistic image.',
    },
    {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
        alt: 'Beach with palm trees',
        title: 'Palm Beach Escape: Coastal Dreams',
        date: 'April 15, 2025',
        category: 'Lifestyle',
        description: 'Experience the ultimate beach escape with palm trees and crystal-clear waters.',
    },
];

const Dashboard = () => {
    const [currentSlide, setCurrentSlide] = React.useState(0);

    // Slider settings
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
        beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
        appendDots: (dots) => (
            <div
                style={{
                    position: 'absolute',
                    bottom: '100px', // Position dots 10px from the bottom
                    width: '100%',
                    height: '600px',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    flexDirection: 'column',
                    padding: '0px',
                }}
            >
                {/* Slide Info Above Dots */}
                <Box
                    sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        color: 'white',
                        padding: '15px 0px 0px 100px',
                        borderRadius: '8px',
                        maxWidth: '100%',
                        textAlign: 'center',
                        mb: 2, // Margin bottom to separate from dots
                    }}
                >
                    <Typography variant="h6">{carouselImages[currentSlide].title}</Typography>
                    <Box display="flex" justifyContent="center" alignItems="center" gap={1} my={1}>
                        <Typography variant="body2">{carouselImages[currentSlide].date}</Typography>
                        <Chip
                            label={carouselImages[currentSlide].category}
                            size="small"
                            sx={{
                                backgroundColor:
                                    carouselImages[currentSlide].category === 'Travel'
                                        ? '#6d28d9'
                                        : carouselImages[currentSlide].category === 'Nature'
                                            ? '#10b981'
                                            : '#f97316',
                                color: 'white',
                            }}
                        />
                    </Box>
                    <Typography variant="body2">{carouselImages[currentSlide].description}</Typography>
                </Box>
                <ul style={{ margin: 0 }}>{dots}</ul>
            </div>
        ),
        customPaging: (i) => (
            <button
                style={{
                    width: '5px',
                    height: '5px',
                    background: 'white',
                    borderRadius: '50%',
                    border: 'none',
                    opacity: 0.7,
                    margin: '3px 5.5px',
                }}
            />
        ),
    };

    return (
        <div>
            <Header />
            <div
                style={{
                    position: 'relative',
                    height: '600px',
                    overflow: 'hidden',
                }}
            >
                <Slider {...sliderSettings}>
                    {carouselImages.map((image, index) => (
                        <div
                            key={index}
                            style={{
                                height: '400px',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            <img
                                src={image.url}
                                alt={image.alt}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block',
                                }}
                            />
                            
                        </div>
                    ))}
                </Slider>
            </div>
            <div style={{ paddingTop: '64px', paddingBottom: '20px' }}>
                <Blogs />
            </div>
            <Footer />
        </div>
    );
};

export default Dashboard;