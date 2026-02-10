import Invoice from '../models/Invoice.model.js';
import Booking from '../models/booking.model.js';
import { success, error } from '../utils/response.js';

/**
 * Create a new invoice for a completed booking
 * POST /api/invoices
 * @protected
 */
export const createInvoice = async (req, res) => {
  try {
    const {
      bookingId,
      lineItems,
      subtotal,
      customerState,
      companyState = 'Maharashtra',
      gstRate = 18,
      paymentMethod,
      notes
    } = req.body;

    // Validate required fields
    if (!bookingId || !lineItems || !subtotal) {
      return error(res, 400, 'Missing required fields: bookingId, lineItems, and subtotal are required');
    }

    // Check if booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return error(res, 404, 'Booking not found');
    }

    // Check if booking is delivered (invoice should only be generated for completed bookings)
    if (booking.status !== 'delivered') {
      return error(res, 400, 'Invoice can only be generated for delivered bookings');
    }

    // Check if invoice already exists for this booking
    const existingInvoice = await Invoice.findOne({ bookingId });
    if (existingInvoice) {
      return error(res, 400, 'Invoice already exists for this booking');
    }

    // Generate unique invoice number
    const invoiceNumber = await Invoice.generateInvoiceNumber();

    // Calculate due date (15 days from issue date)
    const issueDate = new Date();
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + 15);

    // Create invoice object
    const invoiceData = {
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
          state: customerState || '',
          pincode: ''
        }
      },
      lineItems,
      subtotal,
      issueDate,
      dueDate,
      paymentMethod: paymentMethod || '',
      notes: notes || 'Thank you for choosing Harihar Car Carriers. Payment is due within 15 days of invoice date.'
    };

    // Create invoice
    const invoice = new Invoice(invoiceData);

    // Calculate tax breakdown (CGST+SGST for intra-state, IGST for inter-state)
    invoice.calculateTaxBreakdown(customerState, companyState, gstRate);

    // Save invoice
    await invoice.save();

    // Populate booking reference
    await invoice.populate('bookingId');

    return success(res, 201, 'Invoice created successfully', { invoice });
  } catch (err) {
    console.error('Create invoice error:', err);
    return error(res, 500, err.message || 'Failed to create invoice');
  }
};

/**
 * Get all invoices (with pagination and filters)
 * GET /api/invoices
 * @protected (admin only)
 */
export const getAllInvoices = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      paymentStatus,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};

    // Filter by payment status
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Fetch invoices
    const invoices = await Invoice.find(query)
      .populate('bookingId', 'bookingReference vehicleType pickupCity dropCity')
      .populate('userId', 'fullName email phone')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Invoice.countDocuments(query);

    return success(res, 200, 'Invoices fetched successfully', {
      invoices,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalInvoices: total,
        hasMore: skip + invoices.length < total
      }
    });
  } catch (err) {
    console.error('Get all invoices error:', err);
    return error(res, 500, err.message || 'Failed to fetch invoices');
  }
};

/**
 * Get invoice by ID
 * GET /api/invoices/:id
 * @public (for viewing/downloading PDF)
 */
export const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findById(id)
      .populate('bookingId')
      .populate('userId', 'fullName email phone');

    if (!invoice) {
      return error(res, 404, 'Invoice not found');
    }

    return success(res, 200, 'Invoice fetched successfully', { invoice });
  } catch (err) {
    console.error('Get invoice by ID error:', err);
    return error(res, 500, err.message || 'Failed to fetch invoice');
  }
};

/**
 * Get invoice by invoice number
 * GET /api/invoices/number/:invoiceNumber
 * @public
 */
export const getInvoiceByNumber = async (req, res) => {
  try {
    const { invoiceNumber } = req.params;

    const invoice = await Invoice.findOne({ invoiceNumber: invoiceNumber.toUpperCase() })
      .populate('bookingId')
      .populate('userId', 'fullName email phone');

    if (!invoice) {
      return error(res, 404, 'Invoice not found');
    }

    return success(res, 200, 'Invoice fetched successfully', { invoice });
  } catch (err) {
    console.error('Get invoice by number error:', err);
    return error(res, 500, err.message || 'Failed to fetch invoice');
  }
};

/**
 * Get all invoices for the logged-in user (My Invoices)
 * GET /api/invoices/my-invoices
 * @protected
 */
export const getMyInvoices = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return error(res, 401, 'User not authenticated');
    }

    const {
      page = 1,
      limit = 10,
      paymentStatus,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = { userId };

    // Filter by payment status
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Fetch user's invoices
    const invoices = await Invoice.find(query)
      .populate('bookingId', 'bookingReference vehicleType pickupCity dropCity deliveredAt')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Invoice.countDocuments(query);

    return success(res, 200, 'Invoices fetched successfully', {
      invoices,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalInvoices: total,
        hasMore: skip + invoices.length < total
      }
    });
  } catch (err) {
    console.error('Get my invoices error:', err);
    return error(res, 500, err.message || 'Failed to fetch invoices');
  }
};

/**
 * Get invoice by booking ID
 * GET /api/invoices/booking/:bookingId
 * @protected
 */
export const getInvoiceByBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const invoice = await Invoice.findOne({ bookingId })
      .populate('bookingId')
      .populate('userId', 'fullName email phone');

    if (!invoice) {
      return error(res, 404, 'Invoice not found for this booking');
    }

    return success(res, 200, 'Invoice fetched successfully', { invoice });
  } catch (err) {
    console.error('Get invoice by booking error:', err);
    return error(res, 500, err.message || 'Failed to fetch invoice');
  }
};

/**
 * Update invoice payment status
 * PUT /api/invoices/:id/payment
 * @protected (admin only)
 */
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, paymentMethod, paidAmount } = req.body;

    if (!paymentStatus) {
      return error(res, 400, 'Payment status is required');
    }

    const validStatuses = ['unpaid', 'paid', 'partial'];
    if (!validStatuses.includes(paymentStatus)) {
      return error(res, 400, 'Invalid payment status. Must be: unpaid, paid, or partial');
    }

    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return error(res, 404, 'Invoice not found');
    }

    // Update payment fields
    invoice.paymentStatus = paymentStatus;
    if (paymentMethod) {
      invoice.paymentMethod = paymentMethod;
    }
    if (paidAmount !== undefined) {
      invoice.paidAmount = paidAmount;
    }

    // Auto-update payment status based on paid amount
    if (invoice.paidAmount >= invoice.totalAmount) {
      invoice.paymentStatus = 'paid';
    } else if (invoice.paidAmount > 0 && invoice.paidAmount < invoice.totalAmount) {
      invoice.paymentStatus = 'partial';
    } else if (invoice.paidAmount === 0) {
      invoice.paymentStatus = 'unpaid';
    }

    await invoice.save();

    return success(res, 200, 'Payment status updated successfully', { invoice });
  } catch (err) {
    console.error('Update payment status error:', err);
    return error(res, 500, err.message || 'Failed to update payment status');
  }
};

/**
 * Update invoice details
 * PUT /api/invoices/:id
 * @protected (admin only)
 */
export const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Prevent updating certain fields
    delete updates.invoiceNumber;
    delete updates.bookingId;
    delete updates.bookingReference;
    delete updates.createdAt;
    delete updates.updatedAt;

    const invoice = await Invoice.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('bookingId').populate('userId', 'fullName email phone');

    if (!invoice) {
      return error(res, 404, 'Invoice not found');
    }

    return success(res, 200, 'Invoice updated successfully', { invoice });
  } catch (err) {
    console.error('Update invoice error:', err);
    return error(res, 500, err.message || 'Failed to update invoice');
  }
};

/**
 * Delete invoice
 * DELETE /api/invoices/:id
 * @protected (admin only)
 */
export const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findByIdAndDelete(id);

    if (!invoice) {
      return error(res, 404, 'Invoice not found');
    }

    return success(res, 200, 'Invoice deleted successfully', { invoice });
  } catch (err) {
    console.error('Delete invoice error:', err);
    return error(res, 500, err.message || 'Failed to delete invoice');
  }
};
