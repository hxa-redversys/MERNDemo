import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Typography 
} from '@mui/material';
import { format } from 'date-fns';

const AuditLogTable = ({ auditLog }) => {
  console.log('AuditLogTable received:', auditLog);

  if (!auditLog || auditLog.length === 0) {
    return (
      <Typography variant="body1" sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
        No changes recorded
      </Typography>
    );
  }

  const formatValue = (value) => {
    if (value === null || value === undefined) {
      return 'N/A';
    }
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    return String(value);
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Field</TableCell>
            <TableCell>Old Value</TableCell>
            <TableCell>New Value</TableCell>
            <TableCell>Changed By</TableCell>
            <TableCell>Changed At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {auditLog.map((entry, index) => {
            console.log('Rendering audit entry:', entry);
            return (
              <TableRow key={index}>
                <TableCell>{entry.field}</TableCell>
                <TableCell>{formatValue(entry.oldValue)}</TableCell>
                <TableCell>{formatValue(entry.newValue)}</TableCell>
                <TableCell>{entry.changedBy}</TableCell>
                <TableCell>
                  {format(new Date(entry.changedAt), 'MMM d, yyyy HH:mm:ss')}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AuditLogTable;