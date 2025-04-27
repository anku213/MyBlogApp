import React from "react";
import './App.css';
import Route from "./Routes"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

const App = () => {
  document.title = 'MYBLOGAPP'
  return (
    <React.Fragment>
      <ThemeProvider theme={theme}> {/* Your app content */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />
        <Route />
      </ThemeProvider>;
    </React.Fragment>
  );
}

export default App;
