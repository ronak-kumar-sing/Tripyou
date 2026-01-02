const { Tour, BlogPost, Category } = require('../models');

// Search tours and blog posts
exports.search = async (req, res) => {
  try {
    const { q, type = 'all', page = 1, limit = 12 } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    const searchTerm = new RegExp(q.trim(), 'i');
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let tours = [];
    let blogs = [];
    let totalTours = 0;
    let totalBlogs = 0;

    // Search tours
    if (type === 'all' || type === 'tours') {
      const tourResult = await Promise.all([
        Tour.find({
          is_active: true,
          $or: [
            { title: searchTerm },
            { description: searchTerm },
            { short_description: searchTerm },
            { location_city: searchTerm },
          ]
        })
          .populate({
            path: 'category_id',
            select: 'id name slug'
          })
          .limit(type === 'tours' ? parseInt(limit) : 6)
          .skip(type === 'tours' ? offset : 0)
          .sort({ createdAt: -1 }),
        Tour.countDocuments({
          is_active: true,
          $or: [
            { title: searchTerm },
            { description: searchTerm },
            { short_description: searchTerm },
            { location_city: searchTerm },
          ]
        })
      ]);
      tours = tourResult[0];
      totalTours = tourResult[1];
    }

    // Search blog posts
    if (type === 'all' || type === 'blog') {
      const blogResult = await Promise.all([
        BlogPost.find({
          is_published: true,
          $or: [
            { title: searchTerm },
            { content: searchTerm },
            { excerpt: searchTerm },
          ]
        })
          .select('-content')
          .limit(type === 'blog' ? parseInt(limit) : 6)
          .skip(type === 'blog' ? offset : 0)
          .sort({ published_at: -1 }),
        BlogPost.countDocuments({
          is_published: true,
          $or: [
            { title: searchTerm },
            { content: searchTerm },
            { excerpt: searchTerm },
          ]
        })
      ]);
      blogs = blogResult[0];
      totalBlogs = blogResult[1];
    }

    res.json({
      success: true,
      data: {
        tours,
        blogs,
        query: q,
      },
      pagination: {
        tours: { total: totalTours },
        blogs: { total: totalBlogs },
        page: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
