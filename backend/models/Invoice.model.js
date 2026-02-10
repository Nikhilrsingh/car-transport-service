import mongoose from 'mongoose';

const lineItemSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Item description is required'],
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
    default: 1
  },
  unitPrice: {
    type: Number,
    required: [true, 'Unit price is required'],
    min: [0, 'Unit price cannot be negative']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  }
}, { _id: false });

const taxBreakdownSchema = new mongoose.Schema({
  cgst: {
    rate: {
      type: Number,
      default: 9, // 9% CGST (total 18% GST = 9% CGST + 9% SGST)
      min: 0,
      max: 100
    },
    amount: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  sgst: {
    rate: {
      type: Number,
      default: 9, // 9% SGST
      min: 0,
      max: 100
    },
    amount: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  igst: {
    rate: {
      type: Number,
      default: 0, // 18% IGST for inter-state (used instead of CGST+SGST)
      min: 0,
      max: 100
    },
    amount: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  totalTax: {
    type: Number,
    default: 0,
    min: 0
  }
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
  // Invoice Number (Auto-generated: INV-YYYYMM-XXXX)
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },

  // Booking Reference
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'Booking reference is required']
  },
  bookingReference: {
    type: String,
    required: [true, 'Booking reference number is required'],
    trim: true
  },

  // User Reference (if logged in)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  // Customer Details (Bill To)
  customer: {
    fullName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit Indian phone number']
    },
    address: {
      street: {
        type: String,
        trim: true,
        default: ''
      },
      city: {
        type: String,
        trim: true,
        default: ''
      },
      state: {
        type: String,
        trim: true,
        default: ''
      },
      pincode: {
        type: String,
        trim: true,
        match: [/^\d{6}$/, 'Please provide a valid 6-digit pincode'],
        default: ''
      }
    }
  },

  // Line Items (Transport charges, Insurance, Loading/Unloading, etc.)
  lineItems: {
    type: [lineItemSchema],
    required: [true, 'At least one line item is required'],
    validate: {
      validator: function (items) {
        return items && items.length > 0;
      },
      message: 'Invoice must have at least one line item'
    }
  },

  // Pricing Breakdown
  subtotal: {
    type: Number,
    required: [true, 'Subtotal is required'],
    min: [0, 'Subtotal cannot be negative']
  },

  // GST Tax Breakdown (CGST + SGST for intra-state, IGST for inter-state)
  taxBreakdown: {
    type: taxBreakdownSchema,
    required: true,
    default: () => ({})
  },

  // Total Amount (Subtotal + Total Tax)
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },

  // Payment Information
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'partial'],
    default: 'unpaid'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi', 'netbanking', 'wallet', 'other', ''],
    default: ''
  },
  paidAmount: {
    type: Number,
    default: 0,
    min: 0
  },

  // Dates
  issueDate: {
    type: Date,
    required: [true, 'Issue date is required'],
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },

  // Additional Information
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters'],
    default: 'Thank you for choosing Harihar Car Carriers. Payment is due within 15 days of invoice date.'
  },

  // Company Information (for invoice header)
  company: {
    name: {
      type: String,
      default: 'Harihar Car Carriers'
    },
    address: {
      type: String,
      default: 'Head Office: Mumbai, Maharashtra, India'
    },
    phone: {
      type: String,
      default: '+91-9876543210'
    },
    email: {
      type: String,
      default: 'info@hariharcarriers.com'
    },
    gstin: {
      type: String,
      default: '27XXXXX1234X1ZX' // Sample GSTIN format
    }
  }
}, {
  timestamps: true
});

// Indexes for faster queries
invoiceSchema.index({ invoiceNumber: 1 });
invoiceSchema.index({ bookingId: 1 });
invoiceSchema.index({ bookingReference: 1 });
invoiceSchema.index({ userId: 1 });
invoiceSchema.index({ paymentStatus: 1 });
invoiceSchema.index({ issueDate: -1 });
invoiceSchema.index({ createdAt: -1 });

// Static method to generate invoice number (format: INV-YYYYMM-XXXX)
invoiceSchema.statics.generateInvoiceNumber = async function () {
  const prefix = 'INV';
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const yearMonth = `${year}${month}`;
  let invoiceNumber;
  let isUnique = false;

  while (!isUnique) {
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    invoiceNumber = `${prefix}-${yearMonth}-${randomNum}`;

    const existing = await this.findOne({ invoiceNumber });
    if (!existing) {
      isUnique = true;
    }
  }

  return invoiceNumber;
};

// Method to calculate tax breakdown based on customer state
invoiceSchema.methods.calculateTaxBreakdown = function (customerState, companyState, gstRate = 18) {
  const subtotal = this.subtotal;
  const isInterState = customerState !== companyState;

  if (isInterState) {
    // Inter-state: Use IGST
    this.taxBreakdown.igst.rate = gstRate;
    this.taxBreakdown.igst.amount = (subtotal * gstRate) / 100;
    this.taxBreakdown.cgst.rate = 0;
    this.taxBreakdown.cgst.amount = 0;
    this.taxBreakdown.sgst.rate = 0;
    this.taxBreakdown.sgst.amount = 0;
  } else {
    // Intra-state: Use CGST + SGST (split 50-50)
    const halfRate = gstRate / 2;
    this.taxBreakdown.cgst.rate = halfRate;
    this.taxBreakdown.cgst.amount = (subtotal * halfRate) / 100;
    this.taxBreakdown.sgst.rate = halfRate;
    this.taxBreakdown.sgst.amount = (subtotal * halfRate) / 100;
    this.taxBreakdown.igst.rate = 0;
    this.taxBreakdown.igst.amount = 0;
  }

  this.taxBreakdown.totalTax =
    this.taxBreakdown.cgst.amount +
    this.taxBreakdown.sgst.amount +
    this.taxBreakdown.igst.amount;

  this.totalAmount = subtotal + this.taxBreakdown.totalTax;
};

// Virtual for remaining balance
invoiceSchema.virtual('remainingBalance').get(function () {
  return this.totalAmount - this.paidAmount;
});

// Ensure virtuals are included in JSON
invoiceSchema.set('toJSON', { virtuals: true });
invoiceSchema.set('toObject', { virtuals: true });

const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;
