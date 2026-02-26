import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingReference: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  // Customer Information
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit Indian phone number']
  },

  // Vehicle Information
  vehicleType: {
    type: String,
    required: [true, 'Vehicle type is required'],
    enum: ['Sedan', 'SUV', 'Hatchback', 'Luxury', 'Electric', 'Vintage', 'Sports', 'Commercial']
  },
  vehicleModel: {
    type: String,
    trim: true,
    default: ''
  },

  // Route Information
  pickupCity: {
    type: String,
    required: [true, 'Pickup city is required'],
    trim: true
  },
  pickupLocation: {
    type: String,
    required: [true, 'Pickup location is required'],
    trim: true
  },
  dropCity: {
    type: String,
    required: [true, 'Drop city is required'],
    trim: true
  },
  dropLocation: {
    type: String,
    required: [true, 'Drop location is required'],
    trim: true
  },

  // Schedule Information
  pickupDate: {
    type: Date,
    required: [true, 'Pickup date is required']
  },
  pickupTime: {
    type: String,
    default: 'Anytime'
  },

  // Additional Information
  additionalInfo: {
    type: String,
    trim: true,
    maxlength: [500, 'Additional info cannot exceed 500 characters'],
    default: ''
  },

  // Pricing
  estimatedDistance: {
    type: Number,
    default: 0
  },
  estimatedPrice: {
    type: Number,
    default: 0
  },
  finalPrice: {
    type: Number,
    default: 0
  },

  // Status Tracking
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'picked_up', 'in_transit', 'delivered', 'cancelled'],
    default: 'pending'
  },

  // User Reference (if logged in)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  // Timestamps
  confirmedAt: {
    type: Date
  },
  pickedUpAt: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  cancellationReason: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for faster queries
bookingSchema.index({ bookingReference: 1 });
bookingSchema.index({ phone: 1 });
bookingSchema.index({ email: 1 });
bookingSchema.index({ userId: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ createdAt: -1 });

// Method to generate booking reference (format: HCC-YYYYMMDD-XXXXXX)
bookingSchema.statics.generateBookingReference = function () {
  const prefix = 'HCC';
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const dateStr = `${year}${month}${day}`;

  // Increase entropy to 6 random digits (1 million possibilities per day)
  const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `${prefix}-${dateStr}-${randomNum}`;
};

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
