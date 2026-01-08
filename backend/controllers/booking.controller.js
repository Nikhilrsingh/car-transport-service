import { body, validationResult } from 'express-validator';

// Booking validation rules
export const bookingValidationRules = [
    body('personalInfo.fullName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Full name must be 2-50 characters and contain only letters'),
    
    body('personalInfo.phone')
        .trim()
        .matches(/^[6-9]\d{9}$/)
        .withMessage('Phone number must be a valid 10-digit Indian number starting with 6-9'),
    
    body('personalInfo.email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    body('vehicleInfo.type')
        .trim()
        .isIn(['hatchback', 'sedan', 'suv', 'luxury', 'bike', 'commercial'])
        .withMessage('Please select a valid vehicle type'),
    
    body('vehicleInfo.model')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('Vehicle model must not exceed 50 characters'),
    
    body('transportInfo.pickupCity')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Pickup city is required and must be 2-50 characters'),
    
    body('transportInfo.dropCity')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Drop city is required and must be 2-50 characters'),
    
    body('transportInfo.pickupDate')
        .isISO8601()
        .custom((value) => {
            const pickupDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (pickupDate < today) {
                throw new Error('Pickup date cannot be in the past');
            }
            
            // Check blackout dates
            const blackoutDates = [
                '2025-11-15', '2025-12-25', '2025-12-31', '2026-01-01',
                '2026-01-26', '2026-03-08', '2026-08-15', '2026-10-02'
            ];
            
            const dateStr = value.split('T')[0];
            if (blackoutDates.includes(dateStr)) {
                throw new Error('Selected date is unavailable due to holiday/maintenance');
            }
            
            return true;
        }),
    
    body('transportInfo.pickupTime')
        .optional()
        .isIn(['any', 'morning', 'afternoon', 'evening'])
        .withMessage('Invalid pickup time selection'),
    
    body('additionalInfo')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Additional information must not exceed 500 characters'),
    
    body('addons')
        .optional()
        .isArray()
        .withMessage('Addons must be an array'),
    
    body('addons.*')
        .optional()
        .isIn(['cleaning', 'detailing', 'insurance', 'express'])
        .withMessage('Invalid addon selection')
];

// Create booking
export const createBooking = async (req, res) => {
    try {
        // Check validation results
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array().map(error => ({
                    field: error.path,
                    message: error.msg
                }))
            });
        }

        const bookingData = req.body;
        
        // Additional business logic validation
        const businessValidation = validateBusinessRules(bookingData);
        if (!businessValidation.isValid) {
            return res.status(400).json({
                success: false,
                message: 'Business validation failed',
                errors: businessValidation.errors
            });
        }

        // Generate booking reference
        const bookingReference = generateBookingReference();
        
        // Calculate pricing
        const pricing = calculateBookingPrice(bookingData);
        
        // Create booking object with non-final initial status (awaiting payment/approval)
        const booking = {
            reference: bookingReference,
            ...bookingData,
            pricing,
            status: 'pending', // initial non-final state; will transition on payment/approval
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // In a real application, save to database
        // const savedBooking = await BookingModel.create(booking);

        // NOTE: Do NOT send confirmation email or mark as 'confirmed' here.
        // Confirmation should occur in the payment/approval callback where payment is validated,
        // e.g., confirmPayment or bookingConfirmation handler which sets booking.status = 'confirmed'

        // Return success response using actual booking.status (pending)
        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: {
                reference: bookingReference,
                status: booking.status,
                estimatedDelivery: calculateDeliveryDate(bookingData.transportInfo.pickupDate),
                pricing
            }
        });

    } catch (error) {
        console.error('Booking creation error:', error);
        
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        });
    }
};

// Business rules validation
function validateBusinessRules(bookingData) {
    const errors = [];
    
    // Check if pickup and drop cities are different
    if (bookingData.transportInfo.pickupCity.toLowerCase() === 
        bookingData.transportInfo.dropCity.toLowerCase()) {
        errors.push({
            field: 'transportInfo.dropCity',
            message: 'Pickup and drop cities must be different'
        });
    }
    
    // Check vehicle type compatibility with addons
    if (bookingData.vehicleInfo.type === 'bike' && 
        bookingData.addons?.includes('cleaning')) {
        errors.push({
            field: 'addons',
            message: 'Interior cleaning is not available for motorcycles'
        });
    }
    
    // Check date is not too far in future (max 6 months)
    const pickupDate = new Date(bookingData.transportInfo.pickupDate);
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 6);
    
    if (pickupDate > maxDate) {
        errors.push({
            field: 'transportInfo.pickupDate',
            message: 'Pickup date cannot be more than 6 months in advance'
        });
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

// Generate unique booking reference
function generateBookingReference() {
    const prefix = 'HC';
    const year = new Date().getFullYear();
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${year}${timestamp}${random}`;
}

// Calculate booking price
function calculateBookingPrice(bookingData) {
    const baseFares = {
        hatchback: 2000,
        sedan: 2500,
        suv: 3500,
        luxury: 5000,
        bike: 1500,
        commercial: 4000
    };
    
    const addonPrices = {
        cleaning: 500,
        detailing: 1500,
        insurance: 800,
        express: 2000
    };
    
    const baseFare = baseFares[bookingData.vehicleInfo.type] || 2000;
    
    // Mock distance calculation (in real app, use Google Maps API)
    const estimatedDistance = 500; // km
    const distanceCharge = estimatedDistance * 15; // ₹15 per km
    
    const subtotal = baseFare + distanceCharge;
    
    // Calculate addon costs
    const addonCost = (bookingData.addons || [])
        .reduce((total, addon) => total + (addonPrices[addon] || 0), 0);
    
    const totalBeforeTax = subtotal + addonCost;
    const gst = totalBeforeTax * 0.18;
    const total = totalBeforeTax + gst;
    
    return {
        baseFare,
        distanceCharge,
        addonCost,
        subtotal: totalBeforeTax,
        gst,
        total: Math.round(total),
        currency: 'INR'
    };
}

// Calculate estimated delivery date
function calculateDeliveryDate(pickupDate) {
    const pickup = new Date(pickupDate);
    const delivery = new Date(pickup);
    delivery.setDate(delivery.getDate() + 3); // 3 days delivery time
    return delivery.toISOString().split('T')[0];
}

// Mock email service
async function sendBookingConfirmation(booking) {
    // In real application, integrate with email service (SendGrid, AWS SES, etc.)
    // Mask email to avoid logging PII: keep first char and domain
    const rawEmail = booking?.personalInfo?.email || '';
    const maskedEmail = rawEmail
        ? rawEmail.replace(/^(.)(.*)(@.*)$/, (m, p1, mid, domain) => `${p1}***${domain}`)
        : 'redacted';
    console.log(`Sending confirmation for booking ${booking.reference} to ${maskedEmail} (PII not logged)`);
    
    // Mock delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return true;
}

// Get booking by reference
export const getBooking = async (req, res) => {
    try {
        const { reference } = req.params;
        
        if (!reference || !reference.match(/^HC\d{4}\d{6}\d{3}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid booking reference format'
            });
        }
        
        // In real app, fetch from database
        // let booking = await BookingModel.findOne({ reference });

        // Attempt to load booking; if not found, in development return a mock for convenience
        let booking = null;

        if (!booking) {
            if (process.env.NODE_ENV === 'development') {
                booking = {
                    reference,
                    status: 'confirmed',
                    personalInfo: {
                        fullName: 'John Doe',
                        phone: '9876543210',
                        email: 'john@example.com'
                    },
                    transportInfo: {
                        pickupCity: 'Mumbai',
                        dropCity: 'Delhi',
                        pickupDate: '2024-12-25'
                    },
                    createdAt: new Date()
                };
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'Booking not found'
                });
            }
        }

        res.json({
            success: true,
            data: booking
        });
        
    } catch (error) {
        console.error('Get booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Update booking
export const updateBooking = async (req, res) => {
    try {
        const { reference } = req.params;
        const updates = req.body;
        
        // Validate reference format
        if (!reference || !reference.match(/^HC\d{4}\d{6}\d{3}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid booking reference format'
            });
        }
        
        // Whitelist of allowed top-level fields that can be updated
        const ALLOWED_UPDATE_FIELDS = ['vehicleInfo', 'transportInfo', 'additionalInfo', 'addons'];

        // Filter incoming updates to the allowed fields only
        const filteredUpdates = {};
        ALLOWED_UPDATE_FIELDS.forEach(field => {
            if (Object.prototype.hasOwnProperty.call(updates, field)) {
                filteredUpdates[field] = updates[field];
            }
        });

        if (Object.keys(filteredUpdates).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid fields provided for update'
            });
        }

        // Attempt to load the booking (database integration)
        // const bookingInDb = await BookingModel.findOne({ reference });
        let bookingInDb = null;

        // If booking exists in DB, enforce ownership and perform a safe update
        if (bookingInDb) {
            // Ensure requester owns the booking
            if (bookingInDb.userId && req.user && bookingInDb.userId !== req.user.id) {
                return res.status(403).json({ success: false, message: 'Not authorized to update this booking' });
            }

            // Perform safe update (example; uncomment when BookingModel exists)
            // const updatedBooking = await BookingModel.findOneAndUpdate(
            //     { reference },
            //     { ...filteredUpdates, updatedAt: new Date() },
            //     { new: true }
            // );

            // return res.json({ success: true, message: 'Booking updated successfully', data: updatedBooking });
        }

        // If no DB is present, in production return not found; in development allow a mock response
        if (!bookingInDb) {
            if (process.env.NODE_ENV !== 'development') {
                return res.status(404).json({ success: false, message: 'Booking not found' });
            }

            // Development fallback: return filtered updates as the updated data
            return res.json({
                success: true,
                message: 'Booking updated successfully (dev-fallback)',
                data: { reference, ...filteredUpdates }
            });
        }
        
    } catch (error) {
        console.error('Update booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
    try {
        const { reference } = req.params;
        const { reason } = req.body;
        
        if (!reference || !reference.match(/^HC\d{4}\d{6}\d{3}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid booking reference format'
            });
        }
        
        // Calculate refund amount based on cancellation policy
        const refundAmount = calculateRefund(reference);
        
        // In real app, update booking status and process refund
        // await BookingModel.findOneAndUpdate(
        //     { reference },
        //     { 
        //         status: 'cancelled',
        //         cancellationReason: reason,
        //         refundAmount,
        //         cancelledAt: new Date()
        //     }
        // );
        
        res.json({
            success: true,
            message: 'Booking cancelled successfully',
            data: {
                reference,
                refundAmount,
                refundTimeline: '5-7 business days'
            }
        });
        
    } catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Calculate refund based on cancellation policy
function calculateRefund(reference) {
    // Mock calculation - in real app, fetch booking and calculate based on pickup date
    const mockBookingAmount = 5000;
    const hoursBeforePickup = 48; // Mock value
    
    if (hoursBeforePickup > 72) return mockBookingAmount; // 100% refund
    if (hoursBeforePickup > 48) return mockBookingAmount * 0.75; // 75% refund
    if (hoursBeforePickup > 24) return mockBookingAmount * 0.5; // 50% refund
    return mockBookingAmount * 0.25; // 25% refund
}