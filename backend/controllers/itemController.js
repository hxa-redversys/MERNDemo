const Item = require('../models/Item');

const itemController = {
  // Create item
  createItem: async (req, res) => {
    try {
      console.log('Creating new item:', req.body);
      const item = new Item({
        ...req.body,
        auditLog: [{
          field: 'creation',
          oldValue: null,
          newValue: req.body,
          changedBy: 'admin',
          changedAt: new Date()
        }]
      });
      await item.save();
      res.status(201).json(item);
    } catch (error) {
      console.error('Error creating item:', error);
      res.status(400).json({ error: error.message });
    }
  },

  // Get all items
  getItems: async (req, res) => {
    try {
      const items = await Item.find().sort({ createdAt: -1 });
      res.json(items);
    } catch (error) {
      console.error('Error fetching items:', error);
      res.status(500).json({ error: 'Failed to fetch items' });
    }
  },

  // Get single item
  getItem: async (req, res) => {
    try {
      const item = await Item.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
      res.json(item);
    } catch (error) {
      console.error('Error fetching item:', error);
      res.status(500).json({ error: 'Failed to fetch item' });
    }
  },

  // Update item
  updateItem: async (req, res) => {
    try {
      console.log('Updating item with ID:', req.params.id);
      console.log('Update data:', req.body);

      // Find the item first
      const item = await Item.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }

      // Store original values before update
      const originalValues = {
        name: item.name,
        description: item.description,
        category: item.category,
        price: item.price,
        tags: [...(item.tags || [])]
      };

      // Update the fields
      const fieldsToUpdate = ['name', 'description', 'category', 'price', 'tags'];
      fieldsToUpdate.forEach(field => {
        if (req.body[field] !== undefined) {
          item[field] = req.body[field];
        }
      });

      // Create audit entries for changed fields
      const auditEntries = fieldsToUpdate
        .filter(field => 
          JSON.stringify(originalValues[field]) !== JSON.stringify(item[field])
        )
        .map(field => ({
          field,
          oldValue: originalValues[field],
          newValue: item[field],
          changedBy: 'admin',
          changedAt: new Date()
        }));

      console.log('Generated audit entries:', auditEntries);

      // Add audit entries if there are changes
      if (auditEntries.length > 0) {
        if (!item.auditLog) {
          item.auditLog = [];
        }
        item.auditLog.push(...auditEntries);
      }

      // Save the updated item with validation disabled
      const savedItem = await item.save({ validateBeforeSave: false });
      console.log('Saved item with audit log:', savedItem);

      // Fetch and return the updated item
      const updatedItem = await Item.findById(req.params.id);
      res.json(updatedItem);

    } catch (error) {
      console.error('Error updating item:', error);
      res.status(400).json({ error: error.message });
    }
  },

  // Delete item
  deleteItem: async (req, res) => {
    try {
      const item = await Item.findByIdAndDelete(req.params.id);
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
      res.json({ message: 'Item deleted successfully' });
    } catch (error) {
      console.error('Error deleting item:', error);
      res.status(400).json({ error: 'Failed to delete item' });
    }
  },

  // Search items
  // Update the search method to use Atlas Search
searchItems: async (req, res) => {
    try {
      const { query } = req.query;
      
      if (!query) {
        const items = await Item.find();
        return res.json(items);
      }
  
      // Using Atlas Search with compound operator
      const items = await Item.aggregate([
        {
          $search: {
            index: "default", // Make sure this matches your Atlas Search index name
            compound: {
              should: [
                {
                  text: {
                    query: query,
                    path: ["name", "description", "category"],
                    fuzzy: {}
                  }
                },
                {
                  text: {
                    query: query,
                    path: "tags",
                    fuzzy: {}
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
  
      console.log('Atlas Search query:', query);
      console.log('Search results:', items);
  
      res.json(items);
    } catch (error) {
      console.error('Atlas Search error:', error);
      res.status(500).json({ error: 'Search failed' });
    }
  },

  // Get item audit log
  getItemAuditLog: async (req, res) => {
    try {
      const item = await Item.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
      console.log('Retrieved audit log:', item.auditLog);
      res.json(item.auditLog || []);
    } catch (error) {
      console.error('Error fetching audit log:', error);
      res.status(500).json({ error: 'Failed to fetch audit log' });
    }
  },

  // Advanced search with filters
  advancedSearch: async (req, res) => {
    try {
      const { query, category, minPrice, maxPrice, tags } = req.query;
      
      let searchQuery = {};
      
      if (query) {
        searchQuery.$text = { $search: query };
      }
      
      if (category) {
        searchQuery.category = category;
      }
      
      if (minPrice !== undefined || maxPrice !== undefined) {
        searchQuery.price = {};
        if (minPrice !== undefined) searchQuery.price.$gte = parseFloat(minPrice);
        if (maxPrice !== undefined) searchQuery.price.$lte = parseFloat(maxPrice);
      }
      
      if (tags) {
        const tagArray = tags.split(',').map(tag => tag.trim());
        searchQuery.tags = { $all: tagArray };
      }
      
      const items = await Item.find(searchQuery).sort({ createdAt: -1 });
      res.json(items);
    } catch (error) {
      console.error('Advanced search error:', error);
      res.status(500).json({ error: 'Advanced search failed' });
    }
  }
};

module.exports = itemController;