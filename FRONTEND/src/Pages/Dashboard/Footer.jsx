import { Box, Typography, Container } from '@mui/material';

const Footer = () => {
    return (
        <Box sx={{ textAlign: 'center', padding: '10px', background: '#000', color: '#fff' }}>
            <Container maxWidth="lg">
                <Typography variant="body2">Copyright © 2025 Synsoft Global</Typography>
            </Container>
        </Box>
    );
}

export default Footer;