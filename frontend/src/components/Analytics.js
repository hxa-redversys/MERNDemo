import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Container, 
  Paper, 
  Typography,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        console.log('Fetching analytics...');
        const response = await axios.get('http://localhost:5001/api/analytics');
        console.log('Analytics response:', response.data);
        setAnalyticsData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
        setError('Failed to fetch analytics');
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <Typography>Loading analytics...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!analyticsData) return <Typography>No analytics data available</Typography>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Analytics Dashboard</Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Items</Typography>
              <Typography variant="h4">{analyticsData.summary.totalItems}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Value</Typography>
              <Typography variant="h4">${analyticsData.summary.totalValue}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Average Price</Typography>
              <Typography variant="h4">${analyticsData.summary.averagePrice}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Category Distribution</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.categoryDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Price Ranges</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.priceRanges}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Analytics;