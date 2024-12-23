import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Typography,
  Button,
  TextField,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

const ItemList = () => {
  // State management for items and UI
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    tags: ''
  });

  // Fetch items from the server
  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/items');
      console.log('Raw data from server:', response.data);

      const formattedItems = response.data.map(item => {
        const formatted = {
          _id: item._id,
          name: item.name || '',
          description: item.description || '',
          category: item.category || '',
          price: parseFloat(item.price) || 0,
          tags: Array.isArray(item.tags) ? item.tags : []
        };
        console.log('Individual formatted item:', formatted);
        return formatted;
      });

      console.log('All formatted items:', formattedItems);
      setItems(formattedItems);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching items:', err);
      setError('Failed to fetch items');
      setLoading(false);
    }
  };

  // Load items when component mounts
  useEffect(() => {
    fetchItems();
  }, []);

  // Handle search functionality
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchItems();
      return;
    }
    try {
      const response = await axios.get(`http://localhost:5001/api/search?query=${searchQuery}`);
      const formattedItems = response.data.map(item => ({
        _id: item._id,
        name: item.name || '',
        description: item.description || '',
        category: item.category || '',
        price: parseFloat(item.price) || 0,
        tags: Array.isArray(item.tags) ? item.tags : []
      }));
      setItems(formattedItems);
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed');
    }
  };

  // Handle form submission (create/update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const itemData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        price: parseFloat(formData.price) || 0,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
      };

      console.log('Submitting item data:', itemData);

      if (currentItem) {
        // Update existing item
        await axios.put(`http://localhost:5001/api/items/${currentItem._id}`, itemData);
        setSuccessMessage('Item updated successfully');
      } else {
        // Create new item
        await axios.post('http://localhost:5001/api/items', itemData);
        setSuccessMessage('Item created successfully');
      }

      setOpenDialog(false);
      fetchItems();
      resetForm();
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(currentItem ? 'Failed to update item' : 'Failed to create item');
    }
  };

  // Handle item deletion
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/items/${id}`);
      setSuccessMessage('Item deleted successfully');
      fetchItems();
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete item');
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      price: '',
      tags: ''
    });
    setCurrentItem(null);
  };

  // DataGrid column definitions
  const columns = [
    { 
      field: 'name', 
      headerName: 'Name', 
      flex: 1,
      renderCell: (params) => params.row.name
    },
    { 
      field: 'description', 
      headerName: 'Description', 
      flex: 1.5,
      renderCell: (params) => params.row.description
    },
    { 
      field: 'category', 
      headerName: 'Category', 
      flex: 1,
      renderCell: (params) => params.row.category
    },
    { 
      field: 'price', 
      headerName: 'Price', 
      flex: 0.7,
      renderCell: (params) => `$${Number(params.row.price).toFixed(2)}`
    },
    { 
      field: 'tags', 
      headerName: 'Tags', 
      flex: 1,
      renderCell: (params) => params.row.tags.join(', ')
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.8,
      renderCell: (params) => (
        <Box>
          <IconButton 
            onClick={() => {
              setCurrentItem(params.row);
              setFormData({
                name: params.row.name,
                description: params.row.description,
                category: params.row.category,
                price: params.row.price,
                tags: params.row.tags.join(', ')
              });
              setOpenDialog(true);
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row._id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    }
  ];

  // Component render
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        {/* Header section */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Items Management</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              resetForm();
              setOpenDialog(true);
            }}
          >
            Add Item
          </Button>
        </Box>

        {/* Search section */}
        <Box display="flex" gap={1} mb={3}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
          >
            Search
          </Button>
        </Box>

        {/* Messages section */}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>
            {successMessage}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* DataGrid section */}
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={items}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            getRowId={(row) => row._id}
            loading={loading}
            disableSelectionOnClick
            autoHeight
            density="comfortable"
            sx={{
              '& .MuiDataGrid-cell': {
                whiteSpace: 'normal',
                lineHeight: 'normal',
                padding: '8px'
              }
            }}
          />
        </div>
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{currentItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={2}
            />
            <TextField
              fullWidth
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Tags (comma-separated)"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              margin="normal"
              helperText="Enter tags separated by commas"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {currentItem ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default ItemList;