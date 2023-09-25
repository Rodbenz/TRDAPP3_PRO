import * as React from 'react';
import Home from "./pages/Home";
import FirstProcess from "./pages/FirstProcess";
import Import from "./pages/Import";
import Report from "./pages/Report";
import Logout from "./pages/Logout";
import Layout from "./pages/components/report/Layout";
import NotFound from "./pages/NotFound";
import Login from "./pages/index";
import Main from "./pages/Main";
import ViewPostcard from './pages/components/import/ViewPostcard'
// import PageAbout from './pages/PageAbout';
import { Route, Routes } from "react-router";
import { createTheme, ThemeProvider } from '@mui/material/styles';
export default function App() {
  const theme = createTheme({
    typography: {
      fontFamily: [
        'Kanit',
        'Roboto',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/Main" element={<Main />} />
          <Route path="/" element={<Home />} />
          <Route path="/Import/ViewPostcard" element={<ViewPostcard />} />
          <Route path="/Import" element={<Import />} />
          <Route path="/Report" element={<Report />} />
          <Route path="/Layout" element={<Layout />} />
          <Route path="/FirstProcess" element={<FirstProcess />} />
          <Route path="/Logout" element={<Logout />} />
          {/* <Route path="/About" element={<PageAbout />} /> */}
          <Route path='*' exact={true} element={<NotFound />} />
        </Routes>
        {/* <Home /> */}
      </React.Fragment>
      </ThemeProvider>
  );
}
