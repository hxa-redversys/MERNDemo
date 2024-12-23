import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box
} from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import AnalyticsIcon from '@mui/icons-material/Analytics';

const Navbar = ({ setCurrentView }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          MERN Demo
        </Typography>
        <Box>
          <Button 
            color="inherit" 
            startIcon={<StorageIcon />}
            onClick={() => setCurrentView('items')}
          >
            Items
          </Button>
          <Button 
            color="inherit" 
            startIcon={<AnalyticsIcon />}
            onClick={() => setCurrentView('analytics')}
          >
            Analytics
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;