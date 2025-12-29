const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { User, Category, Tour, BlogPost, StaticContent } = require('../models');
const { generateSlug } = require('../utils/helpers');

// Load environment variables
dotenv.config();

// Import seed data
const categoriesData = require('./categories.json');
const toursData = require('./tours.json');
const blogPostsData = require('./blog-posts.json');
const staticContentData = require('./static-content.json');

const seed = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tripyou', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected\n');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Tour.deleteMany({});
    await BlogPost.deleteMany({});
    await StaticContent.deleteMany({});
    console.log('✅ Cleared existing data\n');

    // Seed Admin User
    console.log('👤 Creating admin user...');
    await User.create({
      email: 'admin@tourhub.com',
      password_hash: 'admin123',
      name: 'Admin User',
      phone: '+971501234567',
      is_admin: true,
      is_active: true,
    });
    console.log('   ✅ Admin user created (email: admin@tourhub.com, password: admin123)\n');

    // Create a test user
    await User.create({
      email: 'user@tourhub.com',
      password_hash: 'user123',
      name: 'Test User',
      phone: '+971509876543',
      is_admin: false,
      is_active: true,
    });
    console.log('   ✅ Test user created (email: user@tourhub.com, password: user123)\n');

    // Seed Categories
    console.log('📁 Seeding categories...');
    const categoriesToCreate = categoriesData.map(cat => ({ ...cat, is_active: true }));
    const categories = await Category.insertMany(categoriesToCreate);
    console.log(`   ✅ ${categories.length} categories created\n`);

    // Create category slug to ID map
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.slug] = cat._id;
    });

    // Seed Tours
    console.log('🗺️ Seeding tours...');
    const toursToCreate = toursData.map(tour => ({
      ...tour,
      slug: generateSlug(tour.title),
      category_id: categoryMap[tour.category_slug],
      discount_percent: tour.sale_price
        ? Math.round(((tour.base_price - tour.sale_price) / tour.base_price) * 100)
        : null,
      is_active: true,
    }));

    // Remove category_slug from tour data
    toursToCreate.forEach(tour => delete tour.category_slug);

    const tours = await Tour.insertMany(toursToCreate);
    console.log(`   ✅ ${tours.length} tours created\n`);

    // Seed Blog Posts
    console.log('📝 Seeding blog posts...');
    const blogPostsToCreate = blogPostsData.map(post => ({
      ...post,
      published_at: post.is_published ? new Date() : null,
    }));

    const blogPosts = await BlogPost.insertMany(blogPostsToCreate);
    console.log(`   ✅ ${blogPosts.length} blog posts created\n`);

    // Seed Static Content
    console.log('📄 Seeding static content...');
    const staticContent = await StaticContent.insertMany(staticContentData);
    console.log(`   ✅ ${staticContent.length} static content items created\n`);

    console.log('🎉 Database seeding completed successfully!\n');
    console.log('============================================');
    console.log('Admin Login Credentials:');
    console.log('Email: admin@tourhub.com');
    console.log('Password: admin123');
    console.log('\nTest User Credentials:');
    console.log('Email: user@tourhub.com');
    console.log('Password: user123');
    console.log('============================================\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seed();
