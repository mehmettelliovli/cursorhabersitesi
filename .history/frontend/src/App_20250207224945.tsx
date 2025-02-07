import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import theme from './theme/index';
import { Box } from '@mui/material';
import CategoryNavigation from './components/CategoryNavigation';
import Layout from './components/Layout';

// Public pages
import Home from './pages/Home';
import NewsDetail from './pages/NewsDetail';
import CategoryNews from './pages/CategoryNews';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Her sayfada görünecek navigation */}
            <CategoryNavigation />
            
            {/* Ana içerik */}
            <Box sx={{ flex: 1 }}>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/news/:id" element={<NewsDetail />} />
                  <Route path="/category/:id" element={<CategoryNews />} />
                </Route>
              </Routes>
            </Box>
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
