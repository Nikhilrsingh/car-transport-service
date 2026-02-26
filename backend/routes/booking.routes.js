import express from 'express';
import * as bookingController from '../controllers/booking.controller.js';
import protect, { admin } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * Public routes (no authentication required)
 */

// Create new booking (guest or authenticated)
router.post('/', bookingController.createBooking);

// Get booking by phone and reference (for guest tracking)
router.get('/track', bookingController.getBookingByPhone);

// Get bookings by customer email
router.get('/email/:email', bookingController.getBookingByEmail);

/**
 * Protected routes (authentication required)
 */

// Get all bookings (user's own bookings, or all if admin)
router.get('/', protect, bookingController.getAllBookings);

// Get booking statistics (admin only)
router.get('/admin/stats', protect, admin, bookingController.getBookingStats);

// Get single booking by ID or reference
router.get('/:id', protect, bookingController.getBookingById);

// Update booking status
router.patch('/:id/status', protect, admin, bookingController.updateBookingStatus);

// Update booking details
router.put('/:id', protect, bookingController.updateBooking);

// Delete/Cancel booking
router.delete('/:id', protect, bookingController.deleteBooking);

export default router;
