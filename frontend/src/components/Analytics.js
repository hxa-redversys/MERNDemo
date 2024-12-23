import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'axios';

const Analytics = () => {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/analytics');
      setAnalytics(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch analytics');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Category Analytics
      </Typography>
      <Grid container spacing={3}>
        {analytics.map((category) => (
          <Grid item xs={12} md={6} key={category._id}>
            <Paper elevation={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {category._id || 'Uncategorized'}
                  </Typography>
                  <Typography variant="body1">
                    Average Price: ${category.averagePrice.toFixed(2)}
                  </Typography>
                  <Typography variant="body1">
                    Total Items: {category.totalItems}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                    Items in this category:
                  </Typography>
                  {category.items.map((item, index) => (
                    <Typography key={index} variant="body2">
                      • {item.name}: ${item.price}
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Analytics;