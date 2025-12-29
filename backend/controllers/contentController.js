const { StaticContent } = require('../models');

// Get all content
exports.getAllContent = async (req, res) => {
  try {
    const content = await StaticContent.find();

    // Transform to key-value object
    const contentObj = {};
    content.forEach(item => {
      if (item.type === 'json') {
        try {
          contentObj[item.key] = JSON.parse(item.value);
        } catch {
          contentObj[item.key] = item.value;
        }
      } else {
        contentObj[item.key] = item.value;
      }
    });

    res.json({ success: true, data: contentObj });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get content by key
exports.getContentByKey = async (req, res) => {
  try {
    const content = await StaticContent.findOne({
      key: req.params.key,
    });

    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    let value = content.value;
    if (content.type === 'json') {
      try {
        value = JSON.parse(content.value);
      } catch {
        // Keep as string if JSON parse fails
      }
    }

    res.json({ success: true, data: { key: content.key, value, type: content.type } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get content by section
exports.getContentBySection = async (req, res) => {
  try {
    const content = await StaticContent.find({
      section: req.params.section,
    });

    const contentObj = {};
    content.forEach(item => {
      if (item.type === 'json') {
        try {
          contentObj[item.key] = JSON.parse(item.value);
        } catch {
          contentObj[item.key] = item.value;
        }
      } else {
        contentObj[item.key] = item.value;
      }
    });

    res.json({ success: true, data: contentObj });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update content by key (admin)
exports.updateContent = async (req, res) => {
  try {
    const { value, type, section } = req.body;

    const content = await StaticContent.findOneAndUpdate(
      { key: req.params.key },
      {
        value: typeof value === 'object' ? JSON.stringify(value) : value,
        type: type || 'text',
        section: section || 'general',
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update section content (admin)
exports.updateSection = async (req, res) => {
  try {
    const { section } = req.params;
    const contentData = req.body;

    const updates = [];
    for (const [key, value] of Object.entries(contentData)) {
      const content = await StaticContent.findOneAndUpdate(
        { key },
        {
          value: typeof value === 'object' ? JSON.stringify(value) : value,
          section,
          type: typeof value === 'object' ? 'json' : 'text',
        },
        { upsert: true, new: true }
      );

      updates.push(content);
    }

    res.json({ success: true, message: 'Section updated successfully', data: updates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all content for admin
exports.getAllContentAdmin = async (req, res) => {
  try {
    const content = await StaticContent.find()
      .sort({ section: 1, key: 1 });

    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
