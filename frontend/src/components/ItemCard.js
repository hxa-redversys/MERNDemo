import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AuditLogTable from './AuditLogTable';

const ItemCard = ({ item, onEdit, onDelete }) => {
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [auditLogData, setAuditLogData] = useState([]);

  const fetchAuditLog = async () => {
    try {
      console.log('Fetching audit log for item:', item._id);
      const response = await axios.get(`http://localhost:5001/api/items/${item._id}/audit`);
      console.log('Audit log response:', response.data);
      setAuditLogData(response.data);
    } catch (error) {
      console.error('Error fetching audit log:', error);
    }
  };

  useEffect(() => {
    if (showAuditLog) {
      fetchAuditLog();
    }
  }, [showAuditLog, item._id]);

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {item.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {item.description}
        </Typography>
        <Typography variant="body2">
          <strong>Category:</strong> {item.category}
        </Typography>
        <Typography variant="body2">
          <strong>Price:</strong> ${item.price}
        </Typography>
        {item.tags && item.tags.length > 0 && (
          <Typography variant="body2">
            <strong>Tags:</strong> {item.tags.join(', ')}
          </Typography>
        )}
        
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Button size="small" onClick={() => onEdit(item)}>
            Edit
          </Button>
          <Button size="small" color="error" onClick={() => onDelete(item._id)}>
            Delete
          </Button>
          <Button 
            size="small" 
            color="info" 
            onClick={() => setShowAuditLog(true)}
          >
            View History
          </Button>
        </Box>
      </CardContent>

      <Dialog 
        open={showAuditLog} 
        onClose={() => setShowAuditLog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Change History - {item.name}
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
          <AuditLogTable auditLog={auditLogData} />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ItemCard;