# TourHub - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### 1. Install MongoDB

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Ubuntu/Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

**Windows:**
Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)

**Or use MongoDB Atlas (Cloud - Free Tier):**
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Use it in MONGODB_URI

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and update:
# - MONGODB_URI (if using Atlas, paste your connection string)
# - JWT_SECRET (any random string, minimum 32 characters)

# Seed database with sample data
npm run seed

# Start backend server
npm run dev
```

Backend runs on: **http://localhost:5000**

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_BASE_URL=http://localhost:5000/api" > .env

# Start frontend development server
npm run dev
```

Frontend runs on: **http://localhost:5173**

## 🎉 Done!

Visit **http://localhost:5173** and start exploring!

### Default Admin Credentials:
- **Email:** admin@tourhub.com
- **Password:** admin123

---

## 📁 Project Structure

```
Tripyou/
├── backend/          # Node.js + Express + MongoDB
│   ├── models/       # Mongoose schemas
│   ├── controllers/  # Business logic
│   ├── routes/       # API endpoints
│   └── seeders/      # Sample data
│
└── frontend/         # React + Vite + Tailwind
    ├── src/
    │   ├── pages/    # Page components
    │   ├── components/  # Reusable components
    │   └── services/    # API calls
    └── public/
```

## 🔧 Common Issues

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongosh  # or mongo

# If not running:
brew services start mongodb-community  # macOS
sudo systemctl start mongodb          # Linux
```

### Port Already in Use
```bash
# Find process using port 5000
lsof -ti:5000 | xargs kill -9  # macOS/Linux

# Or change PORT in backend/.env
PORT=5001
```

### Frontend Can't Connect to Backend
- Verify backend is running on port 5000
- Check VITE_API_BASE_URL in frontend/.env
- Ensure no CORS issues (backend has CORS enabled)

---

## 📚 Available Scripts

### Backend
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm run seed     # Seed database with sample data
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## 🌟 Features

### Public Features
- Browse tours with advanced filters
- Search functionality
- Tour booking system
- Blog with categories
- Contact form
- Newsletter subscription

### Admin Features
- Dashboard with statistics
- Manage tours, categories, bookings
- Blog post management
- Contact message handling
- Content management

---

## 📖 API Documentation

Base URL: `http://localhost:5000/api`

### Public Endpoints
- `GET /tours` - Get all tours
- `GET /tours/:slug` - Get tour by slug
- `POST /bookings` - Create booking
- `GET /blog` - Get blog posts
- `POST /contact` - Submit contact form

### Admin Endpoints (Requires Auth)
- `POST /admin/tours` - Create tour
- `PUT /admin/tours/:id` - Update tour
- `DELETE /admin/tours/:id` - Delete tour
- `GET /admin/dashboard/stats` - Get statistics

---

## 🎨 Tech Stack

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (images)
- Nodemailer (emails)

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios

---

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tourhub
JWT_SECRET=your_secret_key_minimum_32_characters
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🚀 Deployment

### Backend
- **Heroku:** `git push heroku main`
- **Railway:** Connect GitHub repo
- **Render:** Connect GitHub repo
- Use MongoDB Atlas for production database

### Frontend
- **Vercel:** `vercel deploy`
- **Netlify:** `netlify deploy`
- **AWS S3 + CloudFront:** Upload build folder

---

## 🤝 Support

For issues or questions, create an issue on GitHub or contact support@tourhub.com

---

**Happy Coding! 🎉**
