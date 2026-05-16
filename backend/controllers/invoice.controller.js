import Invoice from '../models/Invoice.model.js';
import Booking from '../models/booking.model.js';
import { success, error } from '../utils/response.js';

/**
 * @desc    Create a new invoice for a completed booking
 * @route   POST /api/invoices
 * @access  Private (admin)
 */
export const createInvoice = async (req, res, next) => {
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

    // Invoice should only be generated for completed (delivered) bookings
    if (booking.status !== 'delivered') {
      return error(res, 400, 'Invoice can only be generated for delivered bookings');
    }

    // Prevent duplicate invoices for the same booking
    const existingInvoice = await Invoice.findOne({ bookingId });
    if (existingInvoice) {
      return error(res, 400, 'Invoice already exists for this booking');
    }

    const invoiceNumber = await Invoice.generateInvoiceNumber();

    const issueDate = new Date();
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + 15);

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
          pincode: '',
        },
      },
      lineItems,
      subtotal,
      issueDate,
      dueDate,
      paymentMethod: paymentMethod || '',
      notes: notes || 'Thank you for choosing Harihar Car Carriers. Payment is due within 15 days of invoice date.',
    };

    const invoice = new Invoice(invoiceData);
    invoice.calculateTaxBreakdown(customerState, companyState, gstRate);
    await invoice.save();

    await invoice.populate('bookingId');

    return success(res, 201, 'Invoice created successfully', { invoice });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all invoices with pagination and filters
 * @route   GET /api/invoices
 * @access  Private (admin)
 */
export const getAllInvoices = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      paymentStatus,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const invoices = await Invoice.find(query)
      .populate('bookingId', 'bookingReference vehicleType pickupCity dropCity')
      .populate('userId', 'fullName email phone')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Invoice.countDocuments(query);

    return success(res, 200, 'Invoices fetched successfully', {
      invoices,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalInvoices: total,
        hasMore: skip + invoices.length < total,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get invoice by MongoDB ID
 * @route   GET /api/invoices/:id
 * @access  Public (view / download PDF)
 */
export const getInvoiceById = async (req, res, next) => {
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
    next(err);
  }
};

/**
 * @desc    Get invoice by invoice number
 * @route   GET /api/invoices/number/:invoiceNumber
 * @access  Public
 */
export const getInvoiceByNumber = async (req, res, next) => {
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
    next(err);
  }
};

/**
 * @desc    Get all invoices for the currently authenticated user
 * @route   GET /api/invoices/my-invoices
 * @access  Private
 */
export const getMyInvoices = async (req, res, next) => {
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
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const invoices = await Invoice.find(query)
      .populate('bookingId', 'bookingReference vehicleType pickupCity dropCity deliveredAt')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Invoice.countDocuments(query);

    return success(res, 200, 'Invoices fetched successfully', {
      invoices,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalInvoices: total,
        hasMore: skip + invoices.length < total,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get the invoice associated with a specific booking ID
 * @route   GET /api/invoices/booking/:bookingId
 * @access  Private
 */
export const getInvoiceByBooking = async (req, res, next) => {
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
    next(err);
  }
};

/**
 * @desc    Update invoice payment status
 * @route   PUT /api/invoices/:id/payment
 * @access  Private (admin)
 */
export const updatePaymentStatus = async (req, res, next) => {
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

    invoice.paymentStatus = paymentStatus;
    if (paymentMethod) invoice.paymentMethod = paymentMethod;
    if (paidAmount !== undefined) invoice.paidAmount = paidAmount;

    // Automatically derive status from paid amount when a paidAmount is supplied
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
    next(err);
  }
};

/**
 * @desc    Update invoice details (protected fields are stripped)
 * @route   PUT /api/invoices/:id
 * @access  Private (admin)
 */
export const updateInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Prevent updating immutable fields
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
    next(err);
  }
};

/**
 * @desc    Delete an invoice
 * @route   DELETE /api/invoices/:id
 * @access  Private (admin)
 */
export const deleteInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findByIdAndDelete(id);

    if (!invoice) {
      return error(res, 404, 'Invoice not found');
    }

    return success(res, 200, 'Invoice deleted successfully', { invoice });
  } catch (err) {
    next(err);
  }
};
