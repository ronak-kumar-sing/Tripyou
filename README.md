# TourHub - Tourism Booking Platform

A full-stack tourism booking website built with React and Node.js using **MongoDB/Mongoose**, featuring tour listings, booking management, blog, and comprehensive admin panel.

## ⚡ Quick Start

See [QUICKSTART.md](./QUICKSTART.md) for a 5-minute setup guide!

**TL;DR:**
```bash
# 1. Install MongoDB (or use MongoDB Atlas)
brew services start mongodb-community  # macOS

# 2. Backend
cd backend && npm install && npm run seed && npm run dev

# 3. Frontend
cd frontend && npm install && npm run dev
```

Visit **http://localhost:5173** | Admin: `admin@tourhub.com` / `admin123`

## Features

### Public Features
- 🏠 **Home Page** - Hero section, featured tours, categories, deals, blog posts
- 🗺️ **Tours** - Browse tours with filters (category, price, location, sort)
- 🎫 **Tour Details** - Detailed tour information with booking form
- 💰 **Deals** - Special offers and discounted tours
- 📝 **Blog** - Travel tips and destination guides
- 📧 **Contact** - Contact form with email notifications
- 🔍 **Search** - Global search across tours and blog posts
- 👤 **Authentication** - User registration and login

### Admin Features
- 📊 **Dashboard** - Stats, recent bookings, contact messages
- 🗺️ **Tours Management** - CRUD operations for tours
- 📁 **Categories** - Manage tour categories
- 📅 **Bookings** - View and manage all bookings
- 📝 **Blog Management** - Create and manage blog posts
- 💬 **Contact Messages** - View and respond to inquiries
- ⚙️ **Content Settings** - Manage dynamic content

## Tech Stack

### Backend
- **Node.js** & **Express.js** - Server and API
- **MongoDB** - Database
- **Mongoose** - ODM (Object Data Modeling)
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Cloudinary** - Image storage
- **Multer** - File uploads

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **React Hook Form** - Form handling
- **React Toastify** - Notifications
- **Axios** - HTTP client
- **React DatePicker** - Date selection
- **Lucide React** - Icons

## Project Structure

```
Tripyou/
├── backend/
│   ├── config/          # Database, Cloudinary, Email configs
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth, validation, error handling
│   ├── models/          # Sequelize models
│   ├── routes/          # API routes
│   ├── seeders/         # Seed data
│   ├── utils/           # Helper functions
│   ├── .env             # Environment variables
│   ├── server.js        # Entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── context/     # React context
    │   ├── hooks/       # Custom hooks
    │   ├── layouts/     # Layout components
    │   ├── pages/       # Page components
    │   ├── services/    # API services
    │   ├── utils/       # Helper functions
    │   ├── App.jsx      # Main app component
    │   └── main.jsx     # Entry point
    ├── .env             # Environment variables
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v5 or higher) or MongoDB Atlas account
- npm or yarn

### 1. Clone the repository
```bash
cd Tripyou
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
# Server
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/tourhub

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Cloudinary (optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (optional - for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=TourHub <noreply@tourhub.com>
EOF

# Make sure MongoDB is running
# For local MongoDB: brew services start mongodb-community
# Or use MongoDB Atlas for cloud database

# Seed the database with sample data
npm run seed

# Start the server
npm run dev
```

Backend will run on http://localhost:5000

**Note:** For MongoDB Atlas (cloud database):
- Create account at https://www.mongodb.com/cloud/atlas
- Create a cluster and get connection string
- Update MONGODB_URI in .env with your Atlas connection string

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_API_BASE_URL=http://localhost:5000/api
EOF

# Start development server
npm run dev
```

Frontend will run on http://localhost:5173

## Database Seeding

The seed script creates:
- **Admin User**: admin@tourhub.com / admin123
- **8 Categories**: Desert Safari, City Tours, Water Activities, etc.
- **10 Sample Tours** with images and details
- **6 Blog Posts** with content
- **25+ Static Content** items for hero, features, etc.

## API Endpoints

### Public Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/tours` - Get all tours (with filters)
- `GET /api/tours/:slug` - Get tour by slug
- `GET /api/categories` - Get all categories
- `POST /api/bookings` - Create booking
- `GET /api/blog` - Get blog posts
- `POST /api/contact` - Submit contact form
- `POST /api/newsletter/subscribe` - Newsletter subscription
- `GET /api/search?q=query` - Search tours and blog

### Admin Endpoints (Protected)
- `POST /api/admin/tours` - Create tour
- `PUT /api/admin/tours/:id` - Update tour
- `DELETE /api/admin/tours/:id` - Delete tour
- `GET /api/admin/bookings` - Get all bookings
- `PUT /api/admin/bookings/:id/status` - Update booking status
- `GET /api/admin/contacts` - Get contact messages
- `POST /api/admin/blog` - Create blog post
- `GET /api/admin/dashboard/stats` - Get dashboard stats

## Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tourhub_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_FROM=TourHub <noreply@tourhub.com>
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Default Credentials

**Admin Account:**
- Email: admin@tourhub.com
- Password: admin123

## Available Scripts

### Backend
```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm run seed         # Seed database with sample data
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Key Features Implementation

### 1. Authentication
- JWT-based authentication
- Protected routes for admin
- Password hashing with bcrypt
- Persistent login with localStorage

### 2. Tour Booking
- Interactive booking form
- Date selection with react-datepicker
- Price calculation (adults + children)
- Email confirmations

### 3. Search & Filters
- Global search functionality
- Advanced filters (category, price, location)
- Sorting options (newest, price, popularity)
- Real-time results

### 4. Admin Dashboard
- Statistics overview
- Recent bookings and messages
- Full CRUD operations
- Status management

### 5. Responsive Design
- Mobile-first approach
- Tailwind CSS utilities
- Hamburger menu for mobile
- Adaptive layouts

## Deployment

### Backend (Node.js)
1. Set up MongoDB database (local or MongoDB Atlas)
2. Update environment variables
3. Deploy to Heroku, Railway, Render, or DigitalOcean
4. Run seed script

### Frontend (React)
1. Build the project: `npm run build`
2. Deploy `dist` folder to Netlify, Vercel, or AWS S3
3. Update `VITE_API_BASE_URL` to production API

## Troubleshooting

### Database Connection Issues
- Ensure MongoDB is running (`mongod` or `brew services start mongodb-community`)
- Check MONGODB_URI in .env
- For MongoDB Atlas, ensure IP is whitelisted

### CORS Errors
- Ensure backend CORS is configured
- Check frontend API URL in .env

### Image Upload Issues
- Configure Cloudinary credentials
- Check file size limits
- Verify multer configuration

## Future Enhancements

- [ ] Payment gateway integration
- [ ] Reviews and ratings system
- [ ] Multi-language support
- [ ] Tour availability calendar
- [ ] Wishlist functionality
- [ ] Social media integration
- [ ] Email templates
- [ ] Analytics dashboard

## License

MIT

## Support

For support, email support@tourhub.com or open an issue in the repository.
