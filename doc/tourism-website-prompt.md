# Complete Tourism Booking Website - React + Node.js Development Prompt

## Project Overview
Build a full-stack tourism booking website similar to **dubaicitytourism.com** with original design, branding, and assets. The platform enables users to browse and book tours/activities while admins manage content, bookings, and deals.

---

## TECH STACK

### Frontend
- **Framework:** React.js 18+ (with Hooks)
- **Styling:** Tailwind CSS (responsive design)
- **Routing:** React Router v6
- **State Management:** Redux Toolkit or Context API
- **HTTP Client:** Axios
- **Form Handling:** React Hook Form
- **Rich Text Editor:** React Quill (for blog content)
- **Date Picker:** React Date Picker
- **Image Upload:** React Dropzone
- **Charts/Analytics:** Recharts (for admin dashboard)
- **Authentication:** JWT (stored in localStorage with httpOnly cookies)
- **Notifications:** React Toastify
- **Build Tool:** Vite or Create React App

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** PostgreSQL (with Sequelize ORM) OR MongoDB (with Mongoose)
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Image Storage:** Cloudinary API (or local /uploads folder)
- **Email Service:** Nodemailer or SendGrid (for booking confirmations)
- **Validation:** Joi or express-validator
- **CORS:** cors package
- **Environment:** dotenv
- **Payment Gateway:** Stripe API (optional, for future payments)

### Database (PostgreSQL with Sequelize)
**OR** MongoDB with Mongoose - choose one

---

## DATABASE SCHEMA & MODELS

### 1. **Users Table**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  is_admin BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. **Categories Table**
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  type VARCHAR(100), -- 'theme-park', 'water-activities', 'desert-safari', etc.
  icon_url TEXT,
  description TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. **Tours Table**
```sql
CREATE TABLE tours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  short_description VARCHAR(500),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  location_city VARCHAR(100),
  location_country VARCHAR(100),
  base_price DECIMAL(10, 2) NOT NULL,
  sale_price DECIMAL(10, 2),
  discount_percent INT,
  duration_hours INT,
  duration_text VARCHAR(100), -- "2-3 hours", "Full day", etc.
  max_participants INT,
  highlights JSONB, -- ['Highlight 1', 'Highlight 2', ...]
  included JSONB, -- ['Included item 1', 'Included item 2', ...]
  excluded JSONB, -- ['Excluded item 1', ...]
  itinerary JSONB, -- [{time: '09:00 AM', description: '...'}, ...]
  faq JSONB, -- [{question: '...', answer: '...'}, ...]
  images_json JSONB, -- [{url: '...', alt: '...', is_primary: true}, ...]
  is_featured BOOLEAN DEFAULT false,
  is_on_sale BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  seo_meta_title VARCHAR(255),
  seo_meta_description VARCHAR(500),
  seo_keywords VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

### 4. **Bookings Table**
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id UUID NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  booking_date DATE NOT NULL,
  number_of_people INT NOT NULL,
  number_of_children INT DEFAULT 0,
  total_price DECIMAL(10, 2) NOT NULL,
  special_requests TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, completed, cancelled
  payment_status VARCHAR(50) DEFAULT 'unpaid', -- unpaid, paid, refunded
  payment_method VARCHAR(50), -- 'credit_card', 'debit_card', 'paypal', 'bank_transfer'
  stripe_payment_id VARCHAR(255),
  booking_reference VARCHAR(50) UNIQUE,
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tour_id) REFERENCES tours(id)
);
```

### 5. **Blog Posts Table**
```sql
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt VARCHAR(500),
  content TEXT NOT NULL, -- HTML/Rich text
  cover_image_url TEXT,
  category VARCHAR(100), -- 'Guide', 'Story', 'Tips', etc.
  author_name VARCHAR(255),
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP,
  views_count INT DEFAULT 0,
  seo_meta_title VARCHAR(255),
  seo_meta_description VARCHAR(500),
  seo_keywords VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6. **Static Content / Settings Table**
```sql
CREATE TABLE static_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(255) UNIQUE NOT NULL, -- 'hero_title', 'hero_subtitle', 'footer_address', etc.
  value TEXT NOT NULL,
  section VARCHAR(100), -- 'hero', 'footer', 'newsletter', 'features', etc.
  type VARCHAR(50) DEFAULT 'text', -- 'text', 'html', 'image_url', 'json'
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 7. **Contact Submissions Table**
```sql
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  is_replied BOOLEAN DEFAULT false,
  admin_reply TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 8. **Newsletter Subscriptions Table**
```sql
CREATE TABLE newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  is_subscribed BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at TIMESTAMP
);
```

---

## PROJECT FOLDER STRUCTURE

```
tourism-booking-platform/
│
├── backend/                          # Node.js + Express server
│   ├── config/
│   │   ├── database.js              # DB connection
│   │   ├── cloudinary.js            # Image upload config
│   │   └── email.js                 # Email service config
│   │
│   ├── models/                      # Sequelize models
│   │   ├── User.js
│   │   ├── Category.js
│   │   ├── Tour.js
│   │   ├── Booking.js
│   │   ├── BlogPost.js
│   │   ├── StaticContent.js
│   │   ├── ContactSubmission.js
│   │   └── NewsletterSubscription.js
│   │
│   ├── controllers/
│   │   ├── authController.js        # Login, register, JWT
│   │   ├── toursController.js       # GET/POST/PUT/DELETE tours
│   │   ├── categoriesController.js  # Category CRUD
│   │   ├── bookingsController.js    # Booking management
│   │   ├── blogController.js        # Blog CRUD
│   │   ├── contentController.js     # Static content management
│   │   ├── contactController.js     # Contact form handling
│   │   ├── searchController.js      # Tour search & filter
│   │   ├── analyticsController.js   # Dashboard analytics
│   │   └── dashboardController.js   # Admin dashboard stats
│   │
│   ├── routes/
│   │   ├── auth.js                  # POST /api/auth/login, /register, /logout
│   │   ├── tours.js                 # GET /api/tours, POST /api/tours (admin), etc.
│   │   ├── bookings.js              # GET/POST /api/bookings
│   │   ├── blog.js                  # GET/POST /api/blog
│   │   ├── admin.js                 # All admin routes (protected)
│   │   ├── search.js                # GET /api/search
│   │   ├── contact.js               # POST /api/contact
│   │   ├── newsletter.js            # POST /api/newsletter/subscribe
│   │   └── content.js               # GET /api/content
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verification
│   │   ├── adminMiddleware.js       # Admin role check
│   │   ├── errorHandler.js          # Global error handling
│   │   └── validation.js            # Request validation
│   │
│   ├── utils/
│   │   ├── emailService.js          # Send emails (booking confirm, etc.)
│   │   ├── uploadImage.js           # Cloudinary upload helper
│   │   ├── generateReference.js     # Generate booking reference ID
│   │   ├── jwtTokens.js             # JWT creation/verification
│   │   └── seedDatabase.js          # Initial data seed
│   │
│   ├── seeders/                     # Seed data files
│   │   ├── categories.json
│   │   ├── tours.json
│   │   ├── blog-posts.json
│   │   ├── static-content.json
│   │   └── seed.js                  # Run seeders
│   │
│   ├── uploads/                     # Local image storage (if not using Cloudinary)
│   │   ├── tours/
│   │   ├── blog/
│   │   └── categories/
│   │
│   ├── .env                         # Environment variables
│   ├── .env.example
│   ├── server.js                    # Express app entry point
│   ├── package.json
│   └── README.md
│
└── frontend/                         # React app
    ├── src/
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── Navbar.jsx
    │   │   │   ├── Footer.jsx
    │   │   │   ├── Sidebar.jsx (admin)
    │   │   │   ├── Loading.jsx
    │   │   │   └── ErrorBoundary.jsx
    │   │   │
    │   │   ├── home/
    │   │   │   ├── HeroSection.jsx
    │   │   │   ├── TopExperiencesBlock.jsx
    │   │   │   ├── PopularActivitiesCarousel.jsx
    │   │   │   ├── NewsletterSection.jsx
    │   │   │   ├── FeaturesSection.jsx
    │   │   │   └── BlogTeaserSection.jsx
    │   │   │
    │   │   ├── tours/
    │   │   │   ├── TourCard.jsx
    │   │   │   ├── TourList.jsx
    │   │   │   ├── TourDetail.jsx
    │   │   │   ├── TourFilters.jsx
    │   │   │   ├── BookingForm.jsx
    │   │   │   └── TourGallery.jsx
    │   │   │
    │   │   ├── blog/
    │   │   │   ├── BlogCard.jsx
    │   │   │   ├── BlogList.jsx
    │   │   │   └── BlogDetail.jsx
    │   │   │
    │   │   └── admin/
    │   │       ├── AdminLayout.jsx
    │   │       ├── Sidebar.jsx
    │   │       ├── Dashboard.jsx
    │   │       ├── TourManager.jsx
    │   │       ├── CategoryManager.jsx
    │   │       ├── BookingManager.jsx
    │   │       ├── BlogManager.jsx
    │   │       ├── ContentManager.jsx
    │   │       ├── ContactManager.jsx
    │   │       ├── UserManager.jsx
    │   │       └── DealsManager.jsx
    │   │
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── ToursPage.jsx
    │   │   ├── TourDetailPage.jsx
    │   │   ├── DealsPage.jsx
    │   │   ├── BlogPage.jsx
    │   │   ├── BlogDetailPage.jsx
    │   │   ├── ContactPage.jsx
    │   │   ├── SearchResultsPage.jsx
    │   │   │
    │   │   ├── admin/
    │   │   │   ├── AdminDashboard.jsx
    │   │   │   ├── AdminTours.jsx
    │   │   │   ├── AdminCategories.jsx
    │   │   │   ├── AdminBookings.jsx
    │   │   │   ├── AdminBlog.jsx
    │   │   │   ├── AdminContent.jsx
    │   │   │   ├── AdminContacts.jsx
    │   │   │   ├── AdminUsers.jsx
    │   │   │   └── AdminDeals.jsx
    │   │   │
    │   │   ├── auth/
    │   │   │   ├── LoginPage.jsx
    │   │   │   ├── RegisterPage.jsx
    │   │   │   └── LogoutPage.jsx
    │   │   │
    │   │   └── NotFoundPage.jsx
    │   │
    │   ├── hooks/
    │   │   ├── useAuth.js
    │   │   ├── useFetch.js
    │   │   ├── useLocalStorage.js
    │   │   └── useFormValidation.js
    │   │
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   ├── ToursContext.jsx
    │   │   └── NotificationContext.jsx
    │   │
    │   ├── redux/ (if using Redux)
    │   │   ├── slices/
    │   │   │   ├── authSlice.js
    │   │   │   ├── toursSlice.js
    │   │   │   ├── bookingsSlice.js
    │   │   │   └── uiSlice.js
    │   │   └── store.js
    │   │
    │   ├── services/
    │   │   ├── api.js              # Axios instance with base URL
    │   │   ├── authService.js      # Auth API calls
    │   │   ├── toursService.js     # Tours API calls
    │   │   ├── bookingsService.js  # Bookings API calls
    │   │   ├── blogService.js      # Blog API calls
    │   │   └── contactService.js   # Contact API calls
    │   │
    │   ├── styles/
    │   │   ├── index.css
    │   │   ├── tailwind.css
    │   │   └── globals.css
    │   │
    │   ├── utils/
    │   │   ├── constants.js
    │   │   ├── formatters.js       # Date, price formatting
    │   │   ├── validators.js       # Form validation
    │   │   └── errorHandler.js
    │   │
    │   ├── App.jsx                 # Main app component with routing
    │   ├── App.css
    │   └── main.jsx               # Entry point
    │
    ├── public/
    │   ├── images/
    │   │   ├── hero/
    │   │   ├── icons/
    │   │   └── placeholder/
    │   └── favicon.ico
    │
    ├── .env
    ├── .env.example
    ├── vite.config.js (or react-scripts config)
    ├── tailwind.config.js
    ├── package.json
    └── README.md
```

---

## PUBLIC PAGES (FRONTEND)

### 1. **Home Page (`/`)**
**Components:**
- Header/Navbar (fixed, with search bar)
- Hero Section
  - Large background image/video
  - Title: "Your Gateway to [City] Adventures"
  - Subtitle: Promotional text
  - "Call Now" button (phone link)
  - "Browse Tours" CTA button (to /tours)
- Top Experiences Block (6-8 category cards with icons)
- Popular Activities Carousel (featured tours)
- Newsletter Subscription Section
- Features/Benefits Section (4 cards: Large Inventory, Best Prices, Easy Booking, Reliable Support)
- Blog Teaser (4-6 latest posts)
- Footer

**API Calls:**
- GET `/api/tours?featured=true&limit=9`
- GET `/api/categories`
- GET `/api/blog?limit=6`
- GET `/api/content` (hero title, newsletter text, etc.)

---

### 2. **All Tours Page (`/tours`)**
**Components:**
- Sidebar Filters
  - Category filter (checkboxes)
  - Price range slider
  - Duration filter (dropdowns: <2hrs, 2-4hrs, 4-8hrs, Full day)
  - Location filter
  - "On Sale" toggle
- Tour Listings (grid, 12 per page)
  - Tour cards with image, title, location, price (original & sale), duration, rating
- Pagination controls
- Sort options (Price: Low-High, Popularity, Newest)
- Search results count

**API Calls:**
- GET `/api/tours?category=uuid&minPrice=X&maxPrice=Y&duration=Z&location=city&onSale=true&page=1&limit=12&sort=price`

---

### 3. **Tour Detail Page (`/tours/:slug`)**
**Components:**
- Large hero image with gallery (lightbox)
- Tour title, location, rating/reviews count
- Price (original + sale, "On Sale" badge)
- Duration, max participants
- Highlights section (bullet points)
- Itinerary section (timeline)
- Included/Excluded section
- FAQ accordion
- Gallery (carousel or grid)
- Booking form (sticky on right, or full-width below on mobile)
  - Date picker
  - Number of people (adults/children)
  - Special requests textarea
  - Price breakdown
  - "Book Now" button (triggers modal or nav to /checkout)
- Related tours (3-4 similar tours)

**API Calls:**
- GET `/api/tours/:slug`
- POST `/api/bookings` (when booking)

---

### 4. **Deals Page (`/deals`)**
**Components:**
- Hero section: "Special Offers & Deals"
- Filter options (Category, Min savings %, Price range)
- Tour grid showing:
  - Original price (strikethrough)
  - Sale price (highlighted)
  - Discount percentage badge
  - "On Sale" label
- Pagination

**API Calls:**
- GET `/api/tours?onSale=true&page=1&limit=12`

---

### 5. **Blog / Guides Page (`/blog`)**
**Components:**
- Hero section
- Search bar (searches by title, content)
- Category filter (Guide, Story, Tips, etc.)
- Blog post list (grid or list view)
  - Featured image
  - Category label
  - Title
  - Date published
  - 1-2 line excerpt
  - "Read More" link
- Pagination
- "See All Stories" section

**API Calls:**
- GET `/api/blog?category=guide&search=keyword&page=1&limit=9`

---

### 6. **Blog Detail Page (`/blog/:slug` or `/guide/:slug`)**
**Components:**
- Cover image
- Title, date, author, category
- Full content (HTML rendered)
- Share buttons (Facebook, Twitter, WhatsApp, Email, Copy Link)
- Related posts (3-4 similar posts)
- Newsletter signup form
- Comments section (optional)

**API Calls:**
- GET `/api/blog/:slug`
- POST `/api/blog/:slug/views` (increment view count)

---

### 7. **Contact Page (`/contact`)**
**Components:**
- Hero section
- Contact form
  - Name, email, phone, subject, message (textarea)
  - Form validation
  - Submit button with loading state
- Office Info Box
  - Address
  - Phone number
  - Email
  - Google Map embed (optional)
- Success/error messages (toast notifications)

**API Calls:**
- POST `/api/contact` (submit form)

---

### 8. **Search Results Page (`/search?q=keyword`)**
**Components:**
- Search bar (pre-filled with query)
- Filter options (category, price, location, etc.)
- Results count ("Showing X results for 'keyword'")
- Tour/Blog results mixed or separate tabs
- No results message with suggestions

**API Calls:**
- GET `/api/search?q=keyword&type=tours|blog|all`

---

### 9. **Authentication Pages**

#### Login Page (`/auth/login`)
- Email input
- Password input
- "Remember me" checkbox
- "Login" button
- "Forgot password?" link (optional)
- "Sign up" link

#### Register Page (`/auth/register`)
- Name input
- Email input
- Phone input (optional)
- Password input
- Confirm password input
- Terms & conditions checkbox
- "Create Account" button
- "Already have account?" login link

#### Protected Route Redirect
- If user not logged in and tries to access `/admin`, redirect to `/auth/login`

**API Calls:**
- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/logout`

---

## ADMIN PANEL PAGES (PROTECTED ROUTES `/admin/*`)

### **Admin Layout**
- Sidebar with navigation:
  - Dashboard
  - Tours
  - Categories
  - Bookings
  - Blog Posts
  - Content & Settings
  - Contact Submissions
  - Users (if multi-admin)
  - Logout
- Top navbar with:
  - Admin name
  - Profile dropdown
  - Notifications count
  - Logout button

---

### **1. Admin Dashboard (`/admin`)**
**Components:**
- Key metrics cards (grid):
  - Total Tours
  - Total Bookings (this month/all-time)
  - Revenue (optional, if payment tracking)
  - Upcoming Bookings (this week/month)
- Charts (Recharts):
  - Bookings over time (line chart)
  - Tours by category (pie/bar chart)
  - Revenue trends (optional)
- Recent bookings table (latest 10)
  - Tour name, customer name, date, status, action (view details)
- Latest blog posts (5 recent)
- Quick actions (buttons to add tour, new blog post, etc.)

**API Calls:**
- GET `/api/admin/dashboard/stats`
- GET `/api/admin/bookings?limit=10`
- GET `/api/admin/blog?limit=5`

---

### **2. Tours Management (`/admin/tours`)**

#### Tours List
- Table with columns:
  - Tour image (thumbnail)
  - Title
  - Category
  - Base price / Sale price
  - Featured (yes/no badge)
  - On Sale (yes/no badge)
  - Status (Active/Inactive)
  - Actions (Edit, Delete, View)
- Search by title/location
- Filter by category, status
- Sorting (newest, price, name)
- Pagination
- "Add New Tour" button

**API Calls:**
- GET `/api/admin/tours?page=1&limit=20&search=keyword&category=uuid&sort=newest`
- DELETE `/api/admin/tours/:id`

#### Create/Edit Tour Form
- Tour title (required)
- Slug (auto-generated from title, but editable)
- Short description (max 500 chars)
- Full description (rich text editor - React Quill)
- Category dropdown (required)
- Location city & country
- Base price (required, decimal)
- Sale price (optional)
- Duration (hours)
- Duration text ("2-3 hours", "Full day", custom)
- Max participants (optional)
- Highlights (multiple inputs, add/remove rows)
- Included items (multiple inputs)
- Excluded items (multiple inputs)
- Itinerary (table with time & description rows)
- FAQ (table with question & answer rows)
- Image upload/gallery
  - Upload multiple images
  - Drag & drop support
  - Mark primary image
  - Delete image
- Toggles:
  - Is Featured
  - Is On Sale
  - Is Active
- SEO section (collapsible)
  - Meta title
  - Meta description
  - Keywords
- Submit button (Save Tour)
- Cancel button

**API Calls:**
- POST `/api/admin/tours` (create)
- PUT `/api/admin/tours/:id` (update)
- GET `/api/admin/tours/:id` (fetch for editing)

---

### **3. Categories Management (`/admin/categories`)**

#### Categories List
- Table:
  - Category name
  - Slug
  - Type
  - Display order
  - Icon (thumbnail)
  - Active status
  - Actions (Edit, Delete)
- "Add New Category" button

**API Calls:**
- GET `/api/admin/categories`
- DELETE `/api/admin/categories/:id`

#### Create/Edit Category Form
- Category name (required)
- Slug (auto-generated, editable)
- Type (dropdown: theme-park, water-activities, desert-safari, city-tours, etc.)
- Description (optional)
- Icon upload
- Display order (number for sorting)
- Is Active toggle
- Submit button

**API Calls:**
- POST `/api/admin/categories` (create)
- PUT `/api/admin/categories/:id` (update)

---

### **4. Bookings Management (`/admin/bookings`)**

#### Bookings List
- Table:
  - Booking reference ID
  - Tour name
  - Customer name
  - Customer phone
  - Booking date
  - Number of people
  - Total price
  - Status (badge: Pending/Confirmed/Completed/Cancelled)
  - Payment status (Unpaid/Paid/Refunded)
  - Actions (View Details, Edit Status, Delete)
- Filters:
  - Status dropdown (All/Pending/Confirmed/Completed/Cancelled)
  - Date range picker
  - Search by customer name/email
- Pagination
- Export to CSV (optional)

**API Calls:**
- GET `/api/admin/bookings?page=1&limit=20&status=pending&search=keyword&dateFrom=2024-01-01&dateTo=2024-12-31`
- GET `/api/admin/bookings/:id`

#### Booking Detail Modal/Page
- Booking information:
  - Booking reference
  - Tour details (title, location, date)
  - Customer details (name, email, phone)
  - Number of people (adults/children breakdown)
  - Special requests
  - Total price breakdown
- Status update dropdown (with confirmation)
- Payment status update
- Admin notes textarea
- Email customer button (send booking confirmation/details)
- Print booking button
- Delete booking button (with confirmation)

**API Calls:**
- PUT `/api/admin/bookings/:id` (update status, notes)
- POST `/api/admin/bookings/:id/send-email` (send confirmation)
- DELETE `/api/admin/bookings/:id` (delete)

---

### **5. Blog Posts Management (`/admin/blog`)**

#### Blog Posts List
- Table:
  - Featured image (thumbnail)
  - Title
  - Category (badge)
  - Published date
  - Status (Published/Draft)
  - Views count
  - Actions (Edit, Delete, View)
- Search by title
- Filter by category, status
- Pagination
- "Add New Post" button

**API Calls:**
- GET `/api/admin/blog?page=1&limit=20&search=keyword&status=published`
- DELETE `/api/admin/blog/:id`

#### Create/Edit Blog Post Form
- Title (required)
- Slug (auto-generated, editable)
- Category dropdown (Guide, Story, Tips, News, etc.)
- Excerpt (max 500 chars)
- Featured image upload
- Content (rich text editor - React Quill with:
  - Text formatting (bold, italic, underline)
  - Headings (H1-H6)
  - Lists (ordered, unordered)
  - Links
  - Images
  - Code blocks)
- Author name (pre-filled from logged-in admin)
- Published date/time picker
- Status radio (Published/Draft)
- SEO section:
  - Meta title
  - Meta description
  - Keywords
- Preview button (shows how it will look)
- Submit button (Publish/Save as Draft)

**API Calls:**
- POST `/api/admin/blog` (create)
- PUT `/api/admin/blog/:id` (update)
- GET `/api/admin/blog/:id` (fetch for editing)

---

### **6. Deals Management (`/admin/deals`)**

#### Deals List/Overview
- Table of all tours:
  - Tour name
  - Category
  - Base price
  - Sale price
  - Discount % (calculated)
  - Is On Sale toggle (switch)
  - Quick edit (inline edit price/discount)
- Search by tour name
- Filter by category
- Bulk actions (Mark as on sale, remove from sale)

**API Calls:**
- GET `/api/admin/tours?includeOnSale=true`
- PATCH `/api/admin/tours/:id/sale-status` (toggle on sale)
- PUT `/api/admin/tours/:id/sale-price` (update sale price)

---

### **7. Content & Settings (`/admin/settings`)**

#### Static Content Management
Tabbed interface for different sections:

**Tab 1: Hero Section**
- Hero title text
- Hero subtitle text
- "Call Now" button text
- "Browse Tours" button text
- Hero background image upload
- Preview

**Tab 2: Features Section**
- Feature section heading
- Feature cards (4 items):
  - Icon upload
  - Title
  - Description
- Repeating section editor

**Tab 3: Newsletter Section**
- Newsletter section title
- Newsletter description text
- CTA button text
- Discount percentage text (e.g., "Get 20% off")

**Tab 4: Footer**
- Office address
- Phone number
- Email address
- Social links (Facebook URL, Instagram URL, Twitter URL)
- Footer quick links (editable)
- Copyright text

**Tab 5: Contact Info**
- Contact page hero title
- Contact form fields config (optional)

**Tab 6: Homepage Content**
- Featured section title & description
- Blog teaser section title

Each field has:
- Input/textarea/rich text editor
- Save button (with loading state)
- Success/error message

**API Calls:**
- GET `/api/admin/content`
- PATCH `/api/admin/content/:key` (update individual content)
- PUT `/api/admin/content/section/:section` (update full section)

---

### **8. Contact Submissions (`/admin/contacts`)**

#### Submissions List
- Table:
  - Name
  - Email
  - Subject
  - Message preview (first 100 chars)
  - Date submitted
  - Status (Unread/Read, Replied/Unanswered)
  - Actions (View, Reply, Delete)
- Filter by status (All/Unread/Unanswered)
- Search by name/email
- Pagination
- Mark as read/unread (bulk or individual)
- Delete (bulk or individual)

**API Calls:**
- GET `/api/admin/contacts?page=1&limit=20&status=unread`
- PATCH `/api/admin/contacts/:id/read`

#### Submission Detail Modal
- Full contact info (name, email, phone, subject)
- Full message
- Date received
- Admin reply textarea (rich text)
- Reply button (sends email to customer)
- Mark as read/unread toggle
- Delete button

**API Calls:**
- GET `/api/admin/contacts/:id`
- POST `/api/admin/contacts/:id/reply` (send email)
- DELETE `/api/admin/contacts/:id`

---

### **9. Users/Admin Management (`/admin/users`)** *(Optional if multi-admin)*

#### Users List
- Table:
  - Name
  - Email
  - Role (Super Admin / Admin)
  - Status (Active/Inactive)
  - Last login
  - Actions (Edit, Deactivate, Delete)
- "Add New Admin" button

#### Create/Edit Admin Form
- Name (required)
- Email (required)
- Phone (optional)
- Role dropdown (Super Admin / Admin)
- Status toggle (Active/Inactive)
- Temporary password (auto-generated, shown on create)
- Submit button

**API Calls:**
- POST `/api/admin/users` (create admin)
- PUT `/api/admin/users/:id` (update)
- DELETE `/api/admin/users/:id`

---

## BACKEND API ROUTES

### **Authentication Routes**
```
POST   /api/auth/register         - Register new admin
POST   /api/auth/login            - Login (returns JWT)
POST   /api/auth/logout           - Logout (optional, client-side)
POST   /api/auth/refresh-token    - Refresh JWT token
POST   /api/auth/forgot-password  - Send reset link (optional)
POST   /api/auth/reset-password   - Reset password (optional)
```

### **Tours Routes (Public)**
```
GET    /api/tours                 - List all tours (with filters, pagination)
GET    /api/tours/:slug           - Get single tour detail
GET    /api/tours/featured        - Get featured tours
POST   /api/search                - Search tours by keyword, category, location
```

### **Tours Routes (Admin - Protected)**
```
POST   /api/admin/tours           - Create new tour
PUT    /api/admin/tours/:id       - Update tour
DELETE /api/admin/tours/:id       - Delete tour
GET    /api/admin/tours/:id       - Get tour for editing
PATCH  /api/admin/tours/:id/sale-status - Toggle on-sale status
```

### **Categories Routes (Public)**
```
GET    /api/categories            - Get all categories
GET    /api/categories/:slug      - Get single category
```

### **Categories Routes (Admin - Protected)**
```
POST   /api/admin/categories      - Create category
PUT    /api/admin/categories/:id  - Update category
DELETE /api/admin/categories/:id  - Delete category
```

### **Bookings Routes (Public)**
```
POST   /api/bookings              - Create booking
GET    /api/bookings/:reference   - Get booking by reference (for customer)
```

### **Bookings Routes (Admin - Protected)**
```
GET    /api/admin/bookings        - List all bookings (with filters, pagination)
GET    /api/admin/bookings/:id    - Get booking detail
PUT    /api/admin/bookings/:id    - Update booking status/notes
DELETE /api/admin/bookings/:id    - Delete booking
POST   /api/admin/bookings/:id/send-email - Send confirmation email
```

### **Blog Routes (Public)**
```
GET    /api/blog                  - List blog posts (with filters, pagination)
GET    /api/blog/:slug            - Get single blog post
POST   /api/blog/:slug/views      - Increment view count
```

### **Blog Routes (Admin - Protected)**
```
POST   /api/admin/blog            - Create post
PUT    /api/admin/blog/:id        - Update post
DELETE /api/admin/blog/:id        - Delete post
GET    /api/admin/blog/:id        - Get post for editing
```

### **Contact Routes (Public)**
```
POST   /api/contact               - Submit contact form
```

### **Contact Routes (Admin - Protected)**
```
GET    /api/admin/contacts        - List submissions
GET    /api/admin/contacts/:id    - Get submission detail
PATCH  /api/admin/contacts/:id/read - Mark as read
POST   /api/admin/contacts/:id/reply - Reply to submission
DELETE /api/admin/contacts/:id    - Delete submission
```

### **Newsletter Routes (Public)**
```
POST   /api/newsletter/subscribe  - Subscribe to newsletter
POST   /api/newsletter/unsubscribe - Unsubscribe from newsletter
```

### **Content Routes (Public)**
```
GET    /api/content               - Get all static content
GET    /api/content/:key          - Get specific content
```

### **Content Routes (Admin - Protected)**
```
PATCH  /api/admin/content/:key    - Update content
PUT    /api/admin/content/section/:section - Update section
```

### **Dashboard Routes (Admin - Protected)**
```
GET    /api/admin/dashboard/stats - Dashboard statistics
```

### **Users Routes (Admin - Protected)**
```
GET    /api/admin/users           - List all admins
POST   /api/admin/users           - Create new admin
PUT    /api/admin/users/:id       - Update admin
DELETE /api/admin/users/:id       - Delete admin
```

---

## DESIGN & UX GUIDELINES

### **Design System**
- **Primary Color:** Vibrant teal/turquoise (#32B8C6 or similar)
- **Secondary Color:** Warm orange/coral (#E67F61 or similar)
- **Neutral:** Grays, whites, blacks
- **Typography:** Clean sans-serif (Inter, Poppins, or system fonts)
- **Spacing:** Consistent 8px, 16px, 24px, 32px grid
- **Border Radius:** 8px default, 12px for larger elements
- **Shadows:** Subtle shadows for depth (0 1px 3px rgba(0,0,0,0.1), etc.)

### **Responsive Design**
- **Mobile:** 320px+ (hamburger menu, stack layout)
- **Tablet:** 768px+ (sidebar visible, 2-3 column grids)
- **Desktop:** 1024px+ (full layout, 3-4 column grids)

### **Key Features**
- Smooth animations & transitions (0.3s ease)
- Loading spinners for async operations
- Success/error toast notifications (React Toastify)
- Form validation with inline error messages
- SEO-friendly URLs (slugs, meta tags)
- Image optimization (lazy loading, responsive images)
- Accessibility (ARIA labels, keyboard navigation, color contrast)

---

## DEPLOYMENT

### **Backend Deployment**
- **Hosting:** Heroku, Railway, Render, or AWS
- **Database:** PostgreSQL (AWS RDS, Supabase, or local)
- **File Storage:** Cloudinary (for images) or AWS S3
- **Environment Variables:** Store securely (.env file, hosting platform env vars)

### **Frontend Deployment**
- **Hosting:** Vercel, Netlify, or similar
- **Build:** `npm run build` (Vite) or `npm run build` (CRA)
- **Environment Variables:** React env vars (REACT_APP_*)

---

## SAMPLE DATA SEEDING

Create seed files with:
- 5-10 tour categories
- 30-50 sample tours with:
  - Real images (Unsplash, Pexels)
  - Realistic descriptions, prices
  - Mix of featured, on-sale, and regular
- 10-15 blog posts
- 1 admin user (email: admin@example.com, password: secure-password)
- Static content (hero text, footer info, etc.)

---

## IMPLEMENTATION CHECKLIST

- [ ] Backend setup (Express, DB, models)
- [ ] Frontend setup (React, Tailwind, routing)
- [ ] Authentication (JWT login/register)
- [ ] Database seeding
- [ ] Public pages (Home, Tours, Blog, Contact)
- [ ] Tour detail page with booking form
- [ ] Search & filter functionality
- [ ] Admin login & dashboard
- [ ] Admin CRUD pages (Tours, Categories, Bookings, Blog, Content)
- [ ] Image upload integration (Cloudinary or local)
- [ ] Email notifications (booking confirmation)
- [ ] Form validation (frontend & backend)
- [ ] Error handling & logging
- [ ] SEO optimization (meta tags, sitemap)
- [ ] Responsive design testing
- [ ] Performance optimization
- [ ] Security (CORS, SQL injection protection, XSS prevention)
- [ ] Deployment (backend & frontend)
- [ ] Testing (unit, integration)
- [ ] Documentation (API docs, README)

---

## ADDITIONAL FEATURES (Future Enhancements)

- Payment gateway integration (Stripe, PayPal)
- User reviews & ratings system
- Wishlist / saved tours
- Multi-language support
- Real-time notifications
- Email campaigns / Marketing automation
- Analytics & reporting
- Voucher / Coupon system
- Tour availability / Inventory management
- Guide/Staff management
- Customer loyalty program
- Mobile app (React Native / Flutter)
- AI-powered recommendations
- Live chat support

---

## RESOURCES & LIBRARIES

**Frontend:**
- React Router v6
- Axios
- React Hook Form
- React Quill
- React Datepicker
- React Dropzone
- Recharts
- React Toastify
- Tailwind CSS
- clsx / classnames

**Backend:**
- Express.js
- Sequelize (ORM) or Mongoose (MongoDB)
- jsonwebtoken
- bcryptjs
- cors
- dotenv
- multer (file upload) or cloudinary SDK
- nodemailer (or SendGrid)
- joi (validation)

---

## NOTES FOR DEVELOPER

1. **Start with backend API first**, test all routes with Postman
2. **Seed database** with sample data before building frontend
3. **Reuse components** - build generic Tour Card, Blog Card, etc.
4. **Error handling** - catch and display errors gracefully
5. **Loading states** - show loaders for all async operations
6. **Form validation** - validate on both frontend (UX) and backend (security)
7. **Mobile-first design** - start with mobile, scale up
8. **SEO** - use meaningful URLs, meta tags, structured data
9. **Performance** - optimize images, lazy load components, code splitting
10. **Security** - never expose sensitive data, use HTTPS, validate all inputs

---

**This prompt provides everything needed to build a production-ready tourism booking platform similar to dubaicitytourism.com!**
