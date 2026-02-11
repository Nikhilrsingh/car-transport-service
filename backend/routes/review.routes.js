import express from 'express';
import {
  createReview,
  getAllReviews,
  getReviewStats,
  getMyReviews,
  updateReview,
  deleteReview,
  checkReviewEligibility,
} from '../controllers/review.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllReviews); // Get all approved reviews with pagination
router.get('/stats', getReviewStats); // Get review statistics

// Protected routes
router.post('/', protect, createReview); // Create a new review
router.get('/my-reviews', protect, getMyReviews); // Get current user's reviews
router.get('/check/:bookingId', protect, checkReviewEligibility); // Check if user can review
router.put('/:id', protect, updateReview); // Update a review
router.delete('/:id', protect, deleteReview); // Delete a review

export default router;
