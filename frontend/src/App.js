import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Tab, Tabs } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import ItemList from './pages/ItemList';
import Analytics from './components/Analytics';

const App = () => {
  const location = useLocation();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Inventory Management
          </Typography>
          <Tabs 
            value={location.pathname} 
            textColor="inherit"
            indicatorColor="secondary"
          >
            <Tab 
              label="Items" 
              value="/" 
              component={Link} 
              to="/"
            />
            <Tab 
              label="Analytics" 
              value="/analytics" 
              component={Link} 
              to="/analytics"
            />
          </Tabs>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        <Routes>
          <Route path="/" element={<ItemList />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default App;