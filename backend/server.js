require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Schema with Atlas Search index fields
const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, default: '' },
  price: { type: Number, default: 0 },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

const Item = mongoose.model('Item', ItemSchema);

// CRUD Routes
app.post('/api/items', async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create item' });
  }
});

app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

app.put('/api/items/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update item' });
  }
});

app.delete('/api/items/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete item' });
  }
});

// Atlas Search Route
app.get('/api/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      const items = await Item.find();
      return res.json(items);
    }

    const items = await Item.aggregate([
      {
        $search: {
          index: "items_search",
          compound: {
            should: [
              {
                text: {
                  query: query,
                  path: "name",
                  fuzzy: {
                    maxEdits: 2
                  }
                }
              },
              {
                text: {
                  query: query,
                  path: "description",
                  fuzzy: {
                    maxEdits: 2
                  }
                }
              },
              {
                text: {
                  query: query,
                  path: "category",
                  fuzzy: {
                    maxEdits: 2
                  }
                }
              },
              {
                text: {
                  query: query,
                  path: "tags",
                  fuzzy: {
                    maxEdits: 2
                  }
                }
              }
            ]
          }
        }
      },
      {
        $limit: 50
      }
    ]);

    res.json(items);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Analytics Route
app.get('/api/analytics', async (req, res) => {
  try {
    const analytics = await Item.aggregate([
      {
        $group: {
          _id: '$category',
          averagePrice: { $avg: '$price' },
          totalItems: { $sum: 1 },
          items: { $push: { name: '$name', price: '$price' } }
        }
      },
      {
        $sort: { averagePrice: -1 }
      }
    ]);
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Analytics failed' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});