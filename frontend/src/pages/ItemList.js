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
  Alert
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import HistoryIcon from '@mui/icons-material/History';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import AuditLogTable from '../components/AuditLogTable';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    tags: ''
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/items');
      setItems(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch items');
      setLoading(false);
    }
  };

  // Updated search handler to use MongoDB Atlas Search
  const handleSearch = async () => {
    try {
      setLoading(true);
      if (!searchQuery.trim()) {
        await fetchItems();
        return;
      }
      
      console.log('Executing Atlas Search for:', searchQuery);
      const response = await axios.get(`http://localhost:5001/api/search`, {
        params: {
          query: searchQuery
        }
      });
      
      console.log('Atlas Search results:', response.data);
      setItems(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed: ' + err.message);
      setLoading(false);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      category: item.category || '',
      price: item.price || '',
      tags: item.tags ? item.tags.join(', ') : ''
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`http://localhost:5001/api/items/${id}`);
        await fetchItems();
        setSuccessMessage('Item deleted successfully');
      } catch (err) {
        setError('Failed to delete item');
      }
    }
  };

  const handleViewHistory = (item) => {
    console.log('Viewing history for item:', item);
    setSelectedItem(item);
    setShowAuditLog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const itemData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        price: parseFloat(formData.price),
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      };

      if (currentItem) {
        await axios.put(`http://localhost:5001/api/items/${currentItem._id}`, itemData);
        setSuccessMessage('Item updated successfully');
      } else {
        await axios.post('http://localhost:5001/api/items', itemData);
        setSuccessMessage('Item created successfully');
      }

      setOpenDialog(false);
      await fetchItems();
      resetForm();
    } catch (err) {
      setError(currentItem ? 'Failed to update item' : 'Failed to create item');
    }
  };

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

  const columns = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'category', headerName: 'Category', width: 150 },
    { 
      field: 'price', 
      headerName: 'Price', 
      width: 100,
      valueFormatter: (params) => {
        if (params.value === null || params.value === undefined) {
          return '$0.00';
        }
        return `$${Number(params.value).toFixed(2)}`;
      }
    },
    { 
      field: 'tags', 
      headerName: 'Tags', 
      width: 200,
      renderCell: (params) => params.value ? params.value.join(', ') : ''
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row._id)}>
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => handleViewHistory(params.row)}>
            <HistoryIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container>
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}
      
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          label="Search items"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleSearchKeyPress}
          sx={{ flexGrow: 1 }}
        />
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={handleSearch}
        >
          Search
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Item
        </Button>
      </Box>

      <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={items}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          getRowId={(row) => row._id}
          disableSelectionOnClick
        />
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{currentItem ? 'Edit Item' : 'Add Item'}</DialogTitle>
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
            />
            <TextField
              fullWidth
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              margin="normal"
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

      <Dialog 
        open={showAuditLog} 
        onClose={() => setShowAuditLog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Change History
          <IconButton
            aria-label="close"
            onClick={() => setShowAuditLog(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedItem && <AuditLogTable auditLog={selectedItem.auditLog || []} />}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ItemList;