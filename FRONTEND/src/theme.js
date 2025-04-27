import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '25px',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                contained: {
                    borderRadius: '25px',
                },
            },
        },
    },
});

export default theme;