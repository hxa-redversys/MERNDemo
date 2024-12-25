const Item = require('../models/Item');

const analyticsController = {
  getAnalytics: async (req, res) => {
    try {
      console.log('Starting analytics aggregation...');
      
      // Using MongoDB aggregation pipeline
      const [aggregateData] = await Item.aggregate([
        {
          $facet: {
            summary: [
              {
                $group: {
                  _id: null,
                  totalItems: { $sum: 1 },
                  totalValue: { $sum: '$price' },
                  averagePrice: { $avg: '$price' }
                }
              }
            ],
            categoryDistribution: [
              {
                $group: {
                  _id: '$category',
                  count: { $sum: 1 }
                }
              },
              {
                $project: {
                  category: { $ifNull: ['$_id', 'Uncategorized'] },
                  count: 1,
                  _id: 0
                }
              },
              { $sort: { count: -1 } }
            ],
            priceRanges: [
              {
                $bucket: {
                  groupBy: '$price',
                  boundaries: [0, 10, 50, 100, 500, 1000],
                  default: '1000+',
                  output: {
                    count: { $sum: 1 },
                    items: { $push: '$name' }
                  }
                }
              }
            ]
          }
        }
      ]);

      console.log('Aggregation complete:', aggregateData);

      const summary = aggregateData.summary[0] || {
        totalItems: 0,
        totalValue: 0,
        averagePrice: 0
      };

      res.json({
        summary: {
          totalItems: summary.totalItems,
          totalValue: summary.totalValue?.toFixed(2) || '0.00',
          averagePrice: summary.averagePrice?.toFixed(2) || '0.00'
        },
        categoryDistribution: aggregateData.categoryDistribution,
        priceRanges: aggregateData.priceRanges
      });

    } catch (error) {
      console.error('Analytics aggregation error:', error);
      res.status(500).json({ error: 'Failed to fetch analytics: ' + error.message });
    }
  }
};

module.exports = analyticsController;