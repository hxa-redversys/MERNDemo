# MERN Demo
A full-stack application demonstrating MongoDB Atlas capabilities through a SaaS product management system.

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB Atlas** - Cloud database service
- **Mongoose** - MongoDB object modeling
- **Atlas Search** - Full-text search capability
- **MongoDB Charts** - Data visualization

### Frontend
- **React** - UI library
- **Material-UI** - Component library
- **Axios** - HTTP client
- **React Router** - Navigation

## Project Structure
roject-root/
├── backend/
│ ├── controllers/
│ │ ├── itemController.js # Item CRUD operations
│ │ └── analyticsController.js # Analytics aggregation
│ ├── models/
│ │ └── Item.js # Mongoose item schema
│ ├── routes/
│ │ ├── itemRoutes.js # Item endpoints
│ │ └── analyticsRoutes.js # Analytics endpoints
│ ├── scripts/
│ │ └── seedData.js # Database seeding
│ ├── app.js # Express app setup
│ └── server.js # Server entry point
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── Analytics.js # Analytics dashboard
│ │ │ └── AuditLogTable.js # Change tracking
│ │ ├── pages/
│ │ │ └── ItemList.js # Main item management
│ │ ├── App.js # Root component
│ │ └── index.js # Entry point
│ └── package.json
│
└── README.md

## Key Features

### MongoDB Capabilities
- **Flexible Schema**: Dynamic item structure
- **Atlas Search**: Advanced text search with fuzzy matching
- **Aggregation Pipeline**: Complex data analysis
- **MongoDB Charts**: Embedded analytics
- **Change Streams**: Real-time updates

### Application Features
- Item management (CRUD operations)
- Advanced search functionality
- Analytics dashboard
- Real-time data updates
- Audit logging

## Setup and Installation

1. **Clone Repository**
bash
git clone [repository-url]
cd [project-name]

2. **Backend Setup**
```bash
cd backend
npm install
```
Create `.env` file with:
```
MONGODB_URI=your_atlas_connection_string
PORT=5001
```

3. **Frontend Setup**
```bash
cd frontend
npm install
```

4. **Seed Database**
```bash
cd backend
node scripts/seedData.js
```

5. **Run Application**
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

## API Endpoints

### Items
- `GET /api/items` - Get all items
- `POST /api/items` - Create item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item
- `GET /api/search` - Search items

### Analytics
- `GET /api/analytics` - Get analytics data

## MongoDB Atlas Features Used

### Atlas Search
- Full-text search across items
- Fuzzy matching
- Compound queries

### Aggregation Pipeline
- Category distribution analysis
- Price range statistics
- Time-based analytics

### MongoDB Charts
- Product distribution visualization
- Sales analytics
- Category breakdown

## Development Tools
- Visual Studio Code/Cursor
- MongoDB Compass
- Postman/Insomnia
- Git for version control

## Future Enhancements
- User authentication
- Role-based access control
- Advanced analytics
- API documentation
- Integration capabilities

