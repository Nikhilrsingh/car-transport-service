import Review from '../models/review.model.js';
import Booking from '../models/booking.model.js';
import { success, error } from '../utils/response.js';

/**
 * @desc    Create a new review
 * @route   POST /api/reviews
 * @access  Private
 */
export const createReview = async (req, res) => {
  try {
    const { bookingId, rating, title, comment } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!bookingId || !rating || !comment) {
      return error(res, 400, 'Booking ID, rating, and comment are required');
    }

    // Check if booking exists and belongs to user
    const booking = await Booking.findOne({ _id: bookingId, customerId: userId });
    if (!booking) {
      return error(res, 404, 'Booking not found or does not belong to you');
    }

    // Check if booking is completed
    if (booking.status !== 'delivered') {
      return error(res, 400, 'You can only review completed bookings');
    }

    // Check if user already reviewed this booking
    const existingReview = await Review.findOne({ user: userId, booking: bookingId });
    if (existingReview) {
      return error(res, 400, 'You have already reviewed this booking');
    }

    // Create review
    const review = await Review.create({
      user: userId,
      booking: bookingId,
      rating: Number(rating),
      title: title || '',
      comment,
      isVerified: true, // Verified because booking exists
      status: 'approved',
    });

    // Populate user data
    await review.populate('user', 'name email profilePicture');
    await review.populate('booking', 'bookingReference');

    return success(res, 201, 'Review created successfully', review);
  } catch (err) {
    console.error('Create review error:', err);
    return error(res, 500, err.message || 'Failed to create review');
  }
};

/**
 * @desc    Get all approved reviews (public)
 * @route   GET /api/reviews
 * @access  Public
 */
export const getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10, rating, sort = 'recent' } = req.query;

    // Build query
    const query = { status: 'approved' };
    if (rating) {
      query.rating = Number(rating);
    }

    // Determine sort order
    let sortOption;
    switch (sort) {
      case 'recent':
        sortOption = { createdAt: -1 };
        break;
      case 'highest':
        sortOption = { rating: -1, createdAt: -1 };
        break;
      case 'helpful':
        sortOption = { helpfulCount: -1, createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const skip = (Number(page) - 1) * Number(limit);

    // Get reviews with pagination
    const reviews = await Review.find(query)
      .populate('user', 'name profilePicture')
      .sort(sortOption)
      .limit(Number(limit))
      .skip(skip)
      .lean();

    // Get total count
    const total = await Review.countDocuments(query);

    return success(res, 200, 'Reviews fetched successfully', {
      reviews,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    console.error('Get reviews error:', err);
    return error(res, 500, err.message || 'Failed to fetch reviews');
  }
};

/**
 * @desc    Get review statistics
 * @route   GET /api/reviews/stats
 * @access  Public
 */
export const getReviewStats = async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'approved' });

    if (reviews.length === 0) {
      return success(res, 200, 'No reviews yet', {
        averageRating: 0,
        totalReviews: 0,
        ratingBreakdown: {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        },
      });
    }

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = (totalRating / reviews.length).toFixed(1);

    // Calculate rating breakdown
    const ratingBreakdown = {
      5: reviews.filter((r) => r.rating === 5).length,
      4: reviews.filter((r) => r.rating === 4).length,
      3: reviews.filter((r) => r.rating === 3).length,
      2: reviews.filter((r) => r.rating === 2).length,
      1: reviews.filter((r) => r.rating === 1).length,
    };

    return success(res, 200, 'Review stats fetched successfully', {
      averageRating: Number(averageRating),
      totalReviews: reviews.length,
      ratingBreakdown,
    });
  } catch (err) {
    console.error('Get review stats error:', err);
    return error(res, 500, err.message || 'Failed to fetch review stats');
  }
};

/**
 * @desc    Get current user's reviews
 * @route   GET /api/reviews/my-reviews
 * @access  Private
 */
export const getMyReviews = async (req, res) => {
  try {
    const userId = req.user._id;

    const reviews = await Review.find({ user: userId })
      .populate('booking', 'bookingReference pickupLocation deliveryLocation vehicleType status')
      .sort({ createdAt: -1 })
      .lean();

    return success(res, 200, 'Your reviews fetched successfully', reviews);
  } catch (err) {
    console.error('Get my reviews error:', err);
    return error(res, 500, err.message || 'Failed to fetch your reviews');
  }
};

/**
 * @desc    Update a review
 * @route   PUT /api/reviews/:id
 * @access  Private
 */
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, title, comment } = req.body;
    const userId = req.user._id;

    // Find review
    const review = await Review.findById(id);
    if (!review) {
      return error(res, 404, 'Review not found');
    }

    // Check ownership
    if (review.user.toString() !== userId.toString()) {
      return error(res, 403, 'You can only edit your own reviews');
    }

    // Check if editable (within 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    if (review.createdAt < sevenDaysAgo) {
      return error(res, 400, 'Reviews can only be edited within 7 days of posting');
    }

    // Update fields
    if (rating) review.rating = Number(rating);
    if (title !== undefined) review.title = title;
    if (comment) review.comment = comment;

    await review.save();

    await review.populate('user', 'name email profilePicture');
    await review.populate('booking', 'bookingReference');

    return success(res, 200, 'Review updated successfully', review);
  } catch (err) {
    console.error('Update review error:', err);
    return error(res, 500, err.message || 'Failed to update review');
  }
};

/**
 * @desc    Delete a review
 * @route   DELETE /api/reviews/:id
 * @access  Private
 */
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Find review
    const review = await Review.findById(id);
    if (!review) {
      return error(res, 404, 'Review not found');
    }

    // Check ownership
    if (review.user.toString() !== userId.toString()) {
      return error(res, 403, 'You can only delete your own reviews');
    }

    await Review.findByIdAndDelete(id);

    return success(res, 200, 'Review deleted successfully', {});
  } catch (err) {
    console.error('Delete review error:', err);
    return error(res, 500, err.message || 'Failed to delete review');
  }
};

/**
 * @desc    Check if user can review a booking
 * @route   GET /api/reviews/check/:bookingId
 * @access  Private
 */
export const checkReviewEligibility = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user._id;

    // Check if booking exists and belongs to user
    const booking = await Booking.findOne({ _id: bookingId, customerId: userId });
    if (!booking) {
      return success(res, 200, 'Eligible check', { canReview: false, reason: 'Booking not found' });
    }

    // Check if booking is completed
    if (booking.status !== 'delivered') {
      return success(res, 200, 'Eligible check', { canReview: false, reason: 'Booking not completed' });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({ user: userId, booking: bookingId });
    if (existingReview) {
      return success(res, 200, 'Eligible check', { canReview: false, reason: 'Already reviewed', review: existingReview });
    }

    return success(res, 200, 'Eligible check', { canReview: true });
  } catch (err) {
    console.error('Check review eligibility error:', err);
    return error(res, 500, err.message || 'Failed to check eligibility');
  }
};
