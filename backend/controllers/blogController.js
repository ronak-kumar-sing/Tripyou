const { BlogPost } = require('../models');
const { generateSlug } = require('../utils/helpers');

// Get all blog posts (public)
exports.getAllPosts = async (req, res) => {
  try {
    const {
      search,
      page = 1,
      limit = 9,
    } = req.query;

    const query = { is_published: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const posts = await BlogPost.find(query)
      .select('-content')
      .sort({ published_at: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const count = await BlogPost.countDocuments(query);

    res.json({
      success: true,
      data: posts,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single blog post by slug
exports.getPostBySlug = async (req, res) => {
  try {
    const post = await BlogPost.findOne({
      slug: req.params.slug,
      is_published: true,
    });

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Increment view count
exports.incrementViews = async (req, res) => {
  try {
    const post = await BlogPost.findOne({
      slug: req.params.slug,
    });

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    post.views_count = (post.views_count || 0) + 1;
    await post.save();

    res.json({ success: true, message: 'View count updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get related posts
exports.getRelatedPosts = async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug });

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const relatedPosts = await BlogPost.find({
      is_published: true,
      _id: { $ne: post._id },
      category: post.category,
    })
      .select('-content')
      .sort({ published_at: -1 })
      .limit(4);

    res.json({ success: true, data: relatedPosts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create blog post (admin)
exports.createPost = async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      cover_image_url,
      category,
      author_name,
      status,
      featured,
      meta_description,
      meta_keywords,
    } = req.body;

    const finalSlug = slug || generateSlug(title);

    // Check if slug exists
    const existingPost = await BlogPost.findOne({ slug: finalSlug });
    if (existingPost) {
      return res.status(400).json({ success: false, message: 'A post with this title already exists' });
    }

    const post = await BlogPost.create({
      title,
      slug: finalSlug,
      excerpt,
      content,
      cover_image_url,
      category,
      author_name: author_name || 'Admin',
      is_published: status === 'published',
      published_at: status === 'published' ? new Date() : null,
      featured: featured || false,
      meta_description,
      meta_keywords,
    });

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update blog post (admin)
exports.updatePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // If title changed, regenerate slug
    if (req.body.title && req.body.title !== post.title) {
      req.body.slug = req.body.slug || generateSlug(req.body.title);
    }

    // Handle status field
    if (req.body.status) {
      req.body.is_published = req.body.status === 'published';
      if (req.body.is_published && !post.is_published) {
        req.body.published_at = new Date();
      }
      delete req.body.status;
    }

    Object.assign(post, req.body);
    await post.save();

    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete blog post (admin)
exports.deletePost = async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all posts for admin (including drafts)
exports.getAllPostsAdmin = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status === 'published') query.is_published = true;
    if (status === 'draft') query.is_published = false;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const posts = await BlogPost.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const count = await BlogPost.countDocuments(query);

    res.json({
      success: true,
      data: posts,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single post for editing (admin)
exports.getPostForEdit = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
