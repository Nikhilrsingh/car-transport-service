import Review from '../models/review.model.js';
import Booking from '../models/booking.model.js';
import { success, error } from '../utils/response.js';

/**
 * @desc    Create a new review for a completed booking
 * @route   POST /api/reviews
 * @access  Private
 */
export const createReview = async (req, res, next) => {
  try {
    const { bookingId, rating, title, comment } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!bookingId || !rating || !comment) {
      return error(res, 400, 'Booking ID, rating, and comment are required');
    }

    // Check if booking exists and belongs to this user
    const booking = await Booking.findOne({ _id: bookingId, customerId: userId });
    if (!booking) {
      return error(res, 404, 'Booking not found or does not belong to you');
    }

    // Only allow reviews on completed (delivered) bookings
    if (booking.status !== 'delivered') {
      return error(res, 400, 'You can only review completed bookings');
    }

    // Prevent duplicate reviews for the same booking
    const existingReview = await Review.findOne({ user: userId, booking: bookingId });
    if (existingReview) {
      return error(res, 400, 'You have already reviewed this booking');
    }

    const review = await Review.create({
      user: userId,
      booking: bookingId,
      rating: Number(rating),
      title: title || '',
      comment,
      isVerified: true, // Verified because we confirmed the booking exists
      status: 'approved',
    });

    await review.populate('user', 'name email profilePicture');
    await review.populate('booking', 'bookingReference');

    return success(res, 201, 'Review created successfully', review);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all approved reviews (public)
 * @route   GET /api/reviews
 * @access  Public
 */
export const getAllReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, rating, sort = 'recent' } = req.query;

    const query = { status: 'approved' };
    if (rating) query.rating = Number(rating);

    // Determine sort order
    let sortOption;
    switch (sort) {
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

    const reviews = await Review.find(query)
      .populate('user', 'name profilePicture')
      .sort(sortOption)
      .limit(Number(limit))
      .skip(skip)
      .lean();

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
    next(err);
  }
};

/**
 * @desc    Get review statistics (average rating and rating breakdown)
 * @route   GET /api/reviews/stats
 * @access  Public
 */
export const getReviewStats = async (req, res, next) => {
  try {
    const reviews = await Review.find({ status: 'approved' });

    if (reviews.length === 0) {
      return success(res, 200, 'No reviews yet', {
        averageRating: 0,
        totalReviews: 0,
        ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      });
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = (totalRating / reviews.length).toFixed(1);

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
    next(err);
  }
};

/**
 * @desc    Get current user's own reviews
 * @route   GET /api/reviews/my-reviews
 * @access  Private
 */
export const getMyReviews = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const reviews = await Review.find({ user: userId })
      .populate('booking', 'bookingReference pickupLocation deliveryLocation vehicleType status')
      .sort({ createdAt: -1 })
      .lean();

    return success(res, 200, 'Your reviews fetched successfully', reviews);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update a review (owner only, within 7 days of posting)
 * @route   PUT /api/reviews/:id
 * @access  Private
 */
export const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, title, comment } = req.body;
    const userId = req.user._id;

    const review = await Review.findById(id);
    if (!review) {
      return error(res, 404, 'Review not found');
    }

    // Only the review author can edit
    if (review.user.toString() !== userId.toString()) {
      return error(res, 403, 'You can only edit your own reviews');
    }

    // Enforce 7-day edit window
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    if (review.createdAt < sevenDaysAgo) {
      return error(res, 400, 'Reviews can only be edited within 7 days of posting');
    }

    if (rating) review.rating = Number(rating);
    if (title !== undefined) review.title = title;
    if (comment) review.comment = comment;

    await review.save();

    await review.populate('user', 'name email profilePicture');
    await review.populate('booking', 'bookingReference');

    return success(res, 200, 'Review updated successfully', review);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete a review (owner only)
 * @route   DELETE /api/reviews/:id
 * @access  Private
 */
export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(id);
    if (!review) {
      return error(res, 404, 'Review not found');
    }

    // Only the review author can delete
    if (review.user.toString() !== userId.toString()) {
      return error(res, 403, 'You can only delete your own reviews');
    }

    await Review.findByIdAndDelete(id);

    return success(res, 200, 'Review deleted successfully', {});
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Check if a user is eligible to review a booking
 * @route   GET /api/reviews/check/:bookingId
 * @access  Private
 */
export const checkReviewEligibility = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user._id;

    const booking = await Booking.findOne({ _id: bookingId, customerId: userId });
    if (!booking) {
      return success(res, 200, 'Eligibility check', { canReview: false, reason: 'Booking not found' });
    }

    if (booking.status !== 'delivered') {
      return success(res, 200, 'Eligibility check', { canReview: false, reason: 'Booking not completed' });
    }

    const existingReview = await Review.findOne({ user: userId, booking: bookingId });
    if (existingReview) {
      return success(res, 200, 'Eligibility check', { canReview: false, reason: 'Already reviewed', review: existingReview });
    }

    return success(res, 200, 'Eligibility check', { canReview: true });
  } catch (err) {
    next(err);
  }
};
