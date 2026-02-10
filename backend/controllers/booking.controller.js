import Booking from '../models/booking.model.js';
import Invoice from '../models/Invoice.model.js';
import { success, error } from '../utils/response.js';

/**
 * Create a new booking
 */
export const createBooking = async (req, res) => {
  try {
    // Generate unique booking reference
    const bookingReference = await Booking.generateBookingReference();

    // Extract user ID from authenticated user (if logged in)
    const userId = req.user ? req.user._id : null;

    // Create booking with all form data
    const booking = await Booking.create({
      bookingReference,
      userId,
      ...req.body
    });

    return success(res, 201, 'Booking created successfully', {
      booking: {
        _id: booking._id,
        bookingReference: booking.bookingReference,
        fullName: booking.fullName,
        phone: booking.phone,
        vehicleType: booking.vehicleType,
        vehicleModel: booking.vehicleModel,
        pickupCity: booking.pickupCity,
        pickupLocation: booking.pickupLocation,
        dropCity: booking.dropCity,
        dropLocation: booking.dropLocation,
        pickupDate: booking.pickupDate,
        pickupTime: booking.pickupTime,
        estimatedPrice: booking.estimatedPrice,
        status: booking.status,
        createdAt: booking.createdAt
      }
    });

  } catch (err) {
    console.error('Create booking error:', err);
    return error(res, 400, err.message || 'Failed to create booking');
  }
};

/**
 * Get all bookings (with optional filters)
 */
export const getAllBookings = async (req, res) => {
  try {
    const { status, phone, bookingReference, page = 1, limit = 10 } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (phone) filter.phone = phone;
    if (bookingReference) filter.bookingReference = new RegExp(bookingReference, 'i');

    // If user is authenticated, show only their bookings (unless admin)
    if (req.user && !req.user.isAdmin) {
      filter.userId = req.user._id;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .select('-__v');

    const total = await Booking.countDocuments(filter);

    return success(res, 200, 'Bookings fetched successfully', {
      bookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalBookings: total,
        hasMore: skip + bookings.length < total
      }
    });

  } catch (err) {
    console.error('Get bookings error:', err);
    return error(res, 500, err.message || 'Failed to fetch bookings');
  }
};

/**
 * Get single booking by ID or booking reference
 */
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    // Try to find by MongoDB ID first, then by booking reference
    let booking = await Booking.findById(id).select('-__v');

    if (!booking) {
      booking = await Booking.findOne({ bookingReference: id }).select('-__v');
    }

    if (!booking) {
      return error(res, 404, 'Booking not found');
    }

    // Check if user has permission to view this booking
    if (req.user && !req.user.isAdmin && booking.userId && booking.userId.toString() !== req.user._id.toString()) {
      return error(res, 403, 'Unauthorized to view this booking');
    }

    return success(res, 200, 'Booking fetched successfully', { booking });

  } catch (err) {
    console.error('Get booking error:', err);
    return error(res, 500, err.message || 'Failed to fetch booking');
  }
};

/**
 * Get booking by phone number (for guest users to track)
 */
export const getBookingByPhone = async (req, res) => {
  try {
    const { phone, bookingReference } = req.query;

    if (!phone || !bookingReference) {
      return error(res, 400, 'Phone number and booking reference are required');
    }

    const booking = await Booking.findOne({
      phone,
      bookingReference
    }).select('-__v');

    if (!booking) {
      return error(res, 404, 'No booking found with these details');
    }

    return success(res, 200, 'Booking fetched successfully', { booking });

  } catch (err) {
    console.error('Get booking by phone error:', err);
    return error(res, 500, err.message || 'Failed to fetch booking');
  }
};

/**
 * Get bookings by customer email
 */
export const getBookingByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return error(res, 400, 'Email is required');
    }

    const bookings = await Booking.find({ email })
      .select('-__v')
      .sort({ createdAt: -1 });

    if (!bookings.length) {
      return error(res, 404, 'No bookings found for this email');
    }

    return success(res, 200, 'Bookings fetched successfully', { bookings });

  } catch (err) {
    console.error('Get booking by email error:', err);
    return error(res, 500, err.message || 'Failed to fetch bookings');
  }
};

/**
 * Update booking status
 */
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, cancellationReason } = req.body;

    if (!status) {
      return error(res, 400, 'Status is required');
    }

    const validStatuses = ['pending', 'confirmed', 'picked_up', 'in_transit', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return error(res, 400, 'Invalid status value');
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return error(res, 404, 'Booking not found');
    }

    // Update status and timestamps
    booking.status = status;

    if (status === 'confirmed' && !booking.confirmedAt) {
      booking.confirmedAt = new Date();
    } else if (status === 'picked_up' && !booking.pickedUpAt) {
      booking.pickedUpAt = new Date();
    } else if (status === 'delivered' && !booking.deliveredAt) {
      booking.deliveredAt = new Date();

      // Auto-generate invoice for delivered booking
      try {
        const existingInvoice = await Invoice.findOne({ bookingId: booking._id });

        if (!existingInvoice) {
          const invoiceNumber = await Invoice.generateInvoiceNumber();

          // Calculate pricing breakdown
          const basePrice = booking.finalPrice || booking.estimatedPrice || 0;
          const subtotal = basePrice / 1.18; // Remove 18% GST to get subtotal
          const transportCharge = subtotal * 0.85; // 85% transport
          const insurance = subtotal * 0.10; // 10% insurance
          const loadingUnloading = subtotal * 0.05; // 5% loading/unloading

          // Create invoice
          const invoice = new Invoice({
            invoiceNumber,
            bookingId: booking._id,
            bookingReference: booking.bookingReference,
            userId: booking.userId || null,
            customer: {
              fullName: booking.fullName,
              email: booking.email || '',
              phone: booking.phone,
              address: {
                street: booking.pickupLocation || '',
                city: booking.pickupCity || '',
                state: '',
                pincode: ''
              }
            },
            lineItems: [
              {
                description: `Vehicle Transport (${booking.vehicleType || 'Vehicle'}) - ${booking.pickupCity} to ${booking.dropCity}`,
                quantity: 1,
                unitPrice: transportCharge,
                amount: transportCharge
              },
              {
                description: 'Vehicle Insurance Coverage',
                quantity: 1,
                unitPrice: insurance,
                amount: insurance
              },
              {
                description: 'Loading & Unloading Charges',
                quantity: 1,
                unitPrice: loadingUnloading,
                amount: loadingUnloading
              }
            ],
            subtotal: subtotal,
            issueDate: new Date(),
            dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
            paymentStatus: 'unpaid',
            notes: 'Thank you for choosing Harihar Car Carriers. Payment is due within 15 days of invoice date.'
          });

          // Calculate GST (assume same state for demo - intra-state CGST+SGST)
          invoice.calculateTaxBreakdown('Maharashtra', 'Maharashtra', 18);

          await invoice.save();
          console.log(`✅ Invoice ${invoiceNumber} auto-generated for booking ${booking.bookingReference}`);
        }
      } catch (invoiceError) {
        console.error('Failed to auto-generate invoice:', invoiceError);
        // Don't fail the booking update if invoice generation fails
      }
    } else if (status === 'cancelled') {
      booking.cancelledAt = new Date();
      if (cancellationReason) {
        booking.cancellationReason = cancellationReason;
      }
    }

    await booking.save();

    return success(res, 200, 'Booking status updated successfully', { booking });

  } catch (err) {
    console.error('Update status error:', err);
    return error(res, 500, err.message || 'Failed to update booking status');
  }
};

/**
 * Update booking details
 */
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Prevent updating certain fields
    delete updates.bookingReference;
    delete updates._id;
    delete updates.createdAt;
    delete updates.userId;

    const booking = await Booking.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-__v');

    if (!booking) {
      return error(res, 404, 'Booking not found');
    }

    return success(res, 200, 'Booking updated successfully', { booking });

  } catch (err) {
    console.error('Update booking error:', err);
    return error(res, 500, err.message || 'Failed to update booking');
  }
};

/**
 * Delete booking (soft delete by setting status to cancelled)
 */
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return error(res, 404, 'Booking not found');
    }

    // Soft delete: just mark as cancelled
    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    booking.cancellationReason = 'Deleted by user';
    await booking.save();

    return success(res, 200, 'Booking cancelled successfully', {});

  } catch (err) {
    console.error('Delete booking error:', err);
    return error(res, 500, err.message || 'Failed to delete booking');
  }
};

/**
 * Get booking statistics (admin only)
 */
export const getBookingStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const inTransitBookings = await Booking.countDocuments({ status: 'in_transit' });
    const deliveredBookings = await Booking.countDocuments({ status: 'delivered' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });

    // Recent bookings (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentBookings = await Booking.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    return success(res, 200, 'Statistics fetched successfully', {
      stats: {
        total: totalBookings,
        pending: pendingBookings,
        confirmed: confirmedBookings,
        inTransit: inTransitBookings,
        delivered: deliveredBookings,
        cancelled: cancelledBookings,
        last30Days: recentBookings
      }
    });

  } catch (err) {
    console.error('Get stats error:', err);
    return error(res, 500, err.message || 'Failed to fetch statistics');
  }
};