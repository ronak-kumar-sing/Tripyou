const { Tour, Category } = require('../models');
const { generateSlug } = require('../utils/helpers');

// Get all tours with filters
exports.getAllTours = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      location,
      onSale,
      featured,
      page = 1,
      limit = 12,
      sort = 'newest',
      search,
    } = req.query;

    const filter = { is_active: true };

    if (category) filter.category_id = category;
    if (location) filter.location_city = new RegExp(location, 'i');
    if (onSale === 'true') filter.is_on_sale = true;
    if (featured === 'true') filter.is_featured = true;

    if (minPrice || maxPrice) {
      filter.base_price = {};
      if (minPrice) filter.base_price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.base_price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { location_city: new RegExp(search, 'i') },
      ];
    }

    let sortOrder = {};
    switch (sort) {
      case 'price-asc':
        sortOrder = { base_price: 1 };
        break;
      case 'price-desc':
        sortOrder = { base_price: -1 };
        break;
      case 'title':
        sortOrder = { title: 1 };
        break;
      default:
        sortOrder = { createdAt: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tours = await Tour.find(filter)
      .populate('category_id', 'id name slug')
      .sort(sortOrder)
      .limit(parseInt(limit))
      .skip(skip);

    const count = await Tour.countDocuments(filter);

    res.json({
      success: true,
      data: tours,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get tours error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get featured tours
exports.getFeaturedTours = async (req, res) => {
  try {
    const { limit = 9 } = req.query;

    const tours = await Tour.find({
      is_active: true,
      is_featured: true,
    })
      .populate('category_id', 'id name slug')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({ success: true, data: tours });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get on-sale tours
exports.getOnSaleTours = async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tours = await Tour.find({
      is_active: true,
      is_on_sale: true,
    })
      .populate('category_id', 'id name slug')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const count = await Tour.countDocuments({
      is_active: true,
      is_on_sale: true,
    });

    res.json({
      success: true,
      data: tours,
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

// Get single tour by slug
exports.getTourBySlug = async (req, res) => {
  try {
    const tour = await Tour.findOne({
      slug: req.params.slug,
      is_active: true,
    }).populate('category_id');

    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }

    res.json({ success: true, data: tour });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create tour (admin only)
exports.createTour = async (req, res) => {
  try {
    const {
      title, description, short_description, category_id,
      location_city, location_country, base_price, sale_price,
      duration_hours, duration_text, max_participants,
      highlights, included, excluded, itinerary, faq,
      images_json, is_featured, is_on_sale,
      seo_meta_title, seo_meta_description, seo_keywords,
    } = req.body;

    const slug = generateSlug(title);

    // Check if slug exists
    const existingTour = await Tour.findOne({ slug });
    if (existingTour) {
      return res.status(400).json({ success: false, message: 'A tour with this title already exists' });
    }

    // Calculate discount percent if sale price is set
    let discount_percent = null;
    if (sale_price && base_price) {
      discount_percent = Math.round(((base_price - sale_price) / base_price) * 100);
    }

    const tour = new Tour({
      title,
      slug,
      description,
      short_description,
      category_id,
      location_city,
      location_country: location_country || 'UAE',
      base_price,
      sale_price,
      discount_percent,
      duration_hours,
      duration_text,
      max_participants,
      highlights: highlights || [],
      included: included || [],
      excluded: excluded || [],
      itinerary: itinerary || [],
      faq: faq || [],
      images_json: images_json || [],
      is_featured: is_featured || false,
      is_on_sale: is_on_sale || false,
      seo_meta_title,
      seo_meta_description,
      seo_keywords,
      is_active: true,
    });

    await tour.save();

    res.status(201).json({ success: true, data: tour });
  } catch (error) {
    console.error('Create tour error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update tour (admin only)
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }

    // If title changed, regenerate slug
    if (req.body.title && req.body.title !== tour.title) {
      req.body.slug = generateSlug(req.body.title);
    }

    // Recalculate discount if prices changed
    if (req.body.sale_price && req.body.base_price) {
      req.body.discount_percent = Math.round(((req.body.base_price - req.body.sale_price) / req.body.base_price) * 100);
    }

    Object.assign(tour, req.body);
    await tour.save();

    res.json({ success: true, data: tour });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete tour (admin only)
exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }

    res.json({ success: true, message: 'Tour deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get tour for editing (admin)
exports.getTourForEdit = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id).populate('category_id');

    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }

    res.json({ success: true, data: tour });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle sale status (admin)
exports.toggleSaleStatus = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }

    tour.is_on_sale = !tour.is_on_sale;
    await tour.save();

    res.json({ success: true, data: tour });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
