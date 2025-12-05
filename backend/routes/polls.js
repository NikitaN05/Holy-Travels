const express = require('express');
const router = express.Router();
const Poll = require('../models/Poll');
const { auth, isAdmin } = require('../middleware/auth');

// @route   GET /api/polls/active
// @desc    Get active polls
// @access  Private
router.get('/active', auth, async (req, res) => {
  try {
    const now = new Date();
    const polls = await Poll.find({
      status: 'active',
      startDate: { $lte: now },
      endDate: { $gte: now }
    }).select('-options.votes');

    // Add user's vote status
    const pollsWithStatus = polls.map(poll => {
      const hasVoted = poll.participants.includes(req.user._id);
      return { ...poll.toObject(), hasVoted };
    });

    res.json({ success: true, data: pollsWithStatus });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/polls/:id
// @desc    Get poll by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ success: false, message: 'Poll not found' });
    }

    const hasVoted = poll.participants.includes(req.user._id);
    const showResults = hasVoted || poll.showResultsBeforeEnd || poll.status === 'ended';

    let responseData = poll.toObject();
    if (!showResults) {
      responseData.options = responseData.options.map(opt => ({
        ...opt,
        voteCount: undefined,
        votes: undefined
      }));
    }

    res.json({ success: true, data: { ...responseData, hasVoted, showResults } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/polls/:id/vote
// @desc    Vote on a poll
// @access  Private
router.post('/:id/vote', auth, async (req, res) => {
  try {
    const { optionIndex } = req.body;
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ success: false, message: 'Poll not found' });
    }

    if (poll.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Poll is not active' });
    }

    const now = new Date();
    if (now < poll.startDate || now > poll.endDate) {
      return res.status(400).json({ success: false, message: 'Poll is not open for voting' });
    }

    if (!poll.allowMultipleVotes && poll.participants.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'You have already voted' });
    }

    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ success: false, message: 'Invalid option' });
    }

    poll.options[optionIndex].votes.push({
      user: req.user._id,
      votedAt: new Date()
    });
    
    if (!poll.participants.includes(req.user._id)) {
      poll.participants.push(req.user._id);
    }

    poll.updateVoteCounts();
    await poll.save();

    res.json({
      success: true,
      message: 'Vote recorded successfully',
      data: { totalVotes: poll.totalVotes }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/polls/:id/results
// @desc    Get poll results
// @access  Private
router.get('/:id/results', auth, async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ success: false, message: 'Poll not found' });
    }

    const hasVoted = poll.participants.includes(req.user._id);
    if (!hasVoted && !poll.showResultsBeforeEnd && poll.status !== 'ended') {
      return res.status(403).json({ success: false, message: 'Vote first to see results' });
    }

    const results = poll.options.map(opt => ({
      destination: opt.destination,
      voteCount: opt.voteCount,
      percentage: poll.totalVotes > 0 ? Math.round((opt.voteCount / poll.totalVotes) * 100) : 0
    }));

    res.json({
      success: true,
      data: {
        results,
        totalVotes: poll.totalVotes,
        totalParticipants: poll.participants.length,
        winner: poll.winner
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ADMIN ROUTES

// @route   POST /api/polls
// @desc    Create poll (Admin)
// @access  Private/Admin
router.post('/', [auth, isAdmin], async (req, res) => {
  try {
    const {
      title,
      description,
      question,
      options,
      startDate,
      endDate,
      allowMultipleVotes,
      showResultsBeforeEnd
    } = req.body;

    const poll = new Poll({
      title,
      description,
      question,
      options: options.map(opt => ({ destination: opt })),
      startDate,
      endDate,
      allowMultipleVotes,
      showResultsBeforeEnd,
      status: new Date() >= new Date(startDate) ? 'active' : 'draft',
      createdBy: req.user._id
    });

    await poll.save();

    const io = req.app.get('io');
    io.emit('new_poll', { pollId: poll._id, title: poll.title });

    res.status(201).json({
      success: true,
      message: 'Poll created successfully',
      data: poll
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/polls/admin/all
// @desc    Get all polls (Admin)
// @access  Private/Admin
router.get('/admin/all', [auth, isAdmin], async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const query = {};
    if (status) query.status = status;

    const polls = await Poll.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Poll.countDocuments(query);

    res.json({
      success: true,
      data: {
        polls,
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

// @route   PUT /api/polls/:id/end
// @desc    End poll and determine winner (Admin)
// @access  Private/Admin
router.put('/:id/end', [auth, isAdmin], async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ success: false, message: 'Poll not found' });
    }

    poll.status = 'ended';
    poll.endDate = new Date();
    poll.determineWinner();
    await poll.save();

    const io = req.app.get('io');
    io.emit('poll_ended', { pollId: poll._id, winner: poll.winner });

    res.json({
      success: true,
      message: 'Poll ended',
      data: { winner: poll.winner }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/polls/:id
// @desc    Delete poll (Admin)
// @access  Private/Admin
router.delete('/:id', [auth, isAdmin], async (req, res) => {
  try {
    await Poll.findByIdAndUpdate(req.params.id, { status: 'cancelled', isActive: false });
    res.json({ success: true, message: 'Poll deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

