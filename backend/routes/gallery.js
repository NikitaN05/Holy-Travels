const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const { auth, isAdmin, optionalAuth } = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');

// @route   GET /api/gallery
// @desc    Get all albums
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, category, tour, featured } = req.query;

    const query = { isPublic: true };
    if (category) query.category = category;
    if (tour) query.tour = tour;
    if (featured === 'true') query.isFeatured = true;

    const albums = await Gallery.find(query)
      .populate('tour', 'title')
      .select('title description coverImage totalPhotos category tourDate isFeatured')
      .sort({ tourDate: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Gallery.countDocuments(query);

    res.json({
      success: true,
      data: {
        albums,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/gallery/featured
// @desc    Get featured albums
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const albums = await Gallery.find({ isPublic: true, isFeatured: true })
      .populate('tour', 'title')
      .select('title description coverImage totalPhotos category')
      .limit(6)
      .sort({ tourDate: -1 });

    res.json({ success: true, data: albums });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/gallery/categories
// @desc    Get gallery categories with counts
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Gallery.aggregate([
      { $match: { isPublic: true } },
      { $group: { _id: '$category', count: { $sum: 1 }, totalPhotos: { $sum: '$totalPhotos' } } }
    ]);

    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/gallery/:id
// @desc    Get album by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const album = await Gallery.findById(req.params.id)
      .populate('tour', 'title destinations')
      .populate('photos.uploadedBy', 'name')
      .populate('createdBy', 'name');

    if (!album) {
      return res.status(404).json({ success: false, message: 'Album not found' });
    }

    // Increment view count
    album.totalViews += 1;
    await album.save();

    res.json({ success: true, data: album });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/gallery/:id/photos/:photoId/like
// @desc    Like a photo
// @access  Private
router.put('/:id/photos/:photoId/like', auth, async (req, res) => {
  try {
    const album = await Gallery.findById(req.params.id);
    if (!album) {
      return res.status(404).json({ success: false, message: 'Album not found' });
    }

    const photo = album.photos.id(req.params.photoId);
    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }

    const likeIndex = photo.likes.indexOf(req.user._id);
    if (likeIndex > -1) {
      photo.likes.splice(likeIndex, 1);
    } else {
      photo.likes.push(req.user._id);
    }

    await album.save();

    res.json({
      success: true,
      data: {
        liked: likeIndex === -1,
        likesCount: photo.likes.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/gallery/tour/:tourId
// @desc    Get albums for a specific tour
// @access  Public
router.get('/tour/:tourId', async (req, res) => {
  try {
    const albums = await Gallery.find({ tour: req.params.tourId, isPublic: true })
      .select('title description coverImage totalPhotos dayNumber')
      .sort({ dayNumber: 1 });

    res.json({ success: true, data: albums });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ADMIN ROUTES

// @route   POST /api/gallery
// @desc    Create album (Admin)
// @access  Private/Admin
router.post('/', [auth, isAdmin], async (req, res) => {
  try {
    const {
      title,
      description,
      tour,
      tourDate,
      category,
      dayNumber,
      isPublic,
      isFeatured
    } = req.body;

    const album = new Gallery({
      title,
      description,
      tour,
      tourDate,
      category,
      dayNumber,
      isPublic,
      isFeatured,
      createdBy: req.user._id
    });

    await album.save();

    res.status(201).json({
      success: true,
      message: 'Album created successfully',
      data: album
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/gallery/:id/photos
// @desc    Upload photos to album (Admin)
// @access  Private/Admin
router.post('/:id/photos', [auth, isAdmin, uploadImage.array('photos', 50)], async (req, res) => {
  try {
    const album = await Gallery.findById(req.params.id);
    if (!album) {
      return res.status(404).json({ success: false, message: 'Album not found' });
    }

    const captions = req.body.captions ? JSON.parse(req.body.captions) : [];
    const tags = req.body.tags ? JSON.parse(req.body.tags) : [];

    const newPhotos = req.files.map((file, index) => ({
      url: file.path || file.location,
      caption: captions[index] || {},
      tags: tags[index] || [],
      uploadedBy: req.user._id
    }));

    album.photos.push(...newPhotos);
    
    // Set cover image if not set
    if (!album.coverImage && newPhotos.length > 0) {
      album.coverImage = newPhotos[0].url;
    }

    await album.save();

    res.json({
      success: true,
      message: `${newPhotos.length} photos uploaded successfully`,
      data: { totalPhotos: album.totalPhotos }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/gallery/:id
// @desc    Update album (Admin)
// @access  Private/Admin
router.put('/:id', [auth, isAdmin], async (req, res) => {
  try {
    const album = await Gallery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!album) {
      return res.status(404).json({ success: false, message: 'Album not found' });
    }

    res.json({
      success: true,
      message: 'Album updated successfully',
      data: album
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/gallery/:id
// @desc    Delete album (Admin)
// @access  Private/Admin
router.delete('/:id', [auth, isAdmin], async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Album deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/gallery/:id/photos/:photoId
// @desc    Delete photo from album (Admin)
// @access  Private/Admin
router.delete('/:id/photos/:photoId', [auth, isAdmin], async (req, res) => {
  try {
    const album = await Gallery.findById(req.params.id);
    if (!album) {
      return res.status(404).json({ success: false, message: 'Album not found' });
    }

    album.photos.pull(req.params.photoId);
    await album.save();

    res.json({
      success: true,
      message: 'Photo deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

