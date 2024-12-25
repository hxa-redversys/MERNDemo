import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AuditLogTable from '../components/AuditLogTable';

const ItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/items/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch item');
        }
        const data = await response.json();
        setItem(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!item) return <div>Item not found</div>;

  return (
    <div className="item-detail">
      <h2>{item.name}</h2>
      <div className="item-info">
        <p><strong>Description:</strong> {item.description}</p>
        <p><strong>Category:</strong> {item.category}</p>
        <p><strong>Price:</strong> ${item.price}</p>
        <p><strong>Tags:</strong> {item.tags.join(', ')}</p>
      </div>
      
      <AuditLogTable auditLog={item.auditLog} />
    </div>
  );
};

export default ItemDetail;