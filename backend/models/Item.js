const mongoose = require('mongoose');

// Audit Entry Schema
const auditEntrySchema = new mongoose.Schema({
  field: { 
    type: String, 
    required: true 
  },
  oldValue: mongoose.Schema.Types.Mixed,
  newValue: mongoose.Schema.Types.Mixed,
  changedAt: { 
    type: Date, 
    default: Date.now 
  },
  changedBy: { 
    type: String, 
    default: 'admin'
  }
}, { 
  _id: false,
  strict: false 
});

// Item Schema
const ItemSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    default: '' 
  },
  category: { 
    type: String, 
    default: '' 
  },
  price: { 
    type: Number, 
    required: true 
  },
  tags: { 
    type: [String], 
    default: [] 
  },
  auditLog: {
    type: [auditEntrySchema],
    default: []
  }
}, {
  timestamps: true,
  strict: false 
});

// Add text indexes for search functionality
// Update the search handler
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
  } catch (err) {
    console.error('Search error:', err);
    setError('Search failed');
  } finally {
    setLoading(false);
  }
};

const Item = mongoose.model('Item', ItemSchema);

module.exports = Item;