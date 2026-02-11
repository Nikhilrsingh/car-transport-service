/**
 * Setup Review Test
 * Creates a test user, a delivered booking, and some appoved reviews.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Review from '../models/review.model.js';
import User from '../models/User.model.js';
import Booking from '../models/booking.model.js';

dotenv.config();

async function setup() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // 1. Create/Find Test User
    let user = await User.findOne({ email: 'test@example.com' });
    if (!user) {
      user = await User.create({
        name: 'Test Customer',
        email: 'test@example.com',
        password: 'password123',
        phone: '+919876543210'
      });
      console.log('✅ Test user created');
    }

    // 2. Create Delivered Booking
    const booking = await Booking.create({
      user: user._id,
      bookingReference: 'TEST-REIVEW-001',
      fullName: 'Test Customer',
      email: 'test@example.com',
      phone: '+919876543210',
      pickupCity: 'Mumbai',
      dropCity: 'Delhi',
      vehicleType: 'Sedan',
      status: 'delivered',
      pickupDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      finalPrice: 15000
    });
    console.log('✅ Delivered booking created');

    // 3. Create Sample Reviews
    const sampleReviews = [
      {
        user: user._id,
        booking: booking._id,
        rating: 5,
        title: 'Excellent Service!',
        comment: 'The car transport service was exceptional. My vehicle arrived on time and in perfect condition. Highly recommend!',
        status: 'approved',
        isVerified: true
      },
      {
        user: user._id,
        booking: booking._id,
        rating: 4,
        title: 'Very Professional',
        comment: 'Professional staff and timely delivery. The tracking system was very helpful throughout the process.',
        status: 'approved',
        isVerified: true
      }
    ];

    await Review.deleteMany({}); // Clear existing reviews for clean test
    await Review.insertMany(sampleReviews);
    console.log('✅ Sample reviews created');

    console.log('\n--- Setup Complete ---');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    console.log('You can now see reviews on the homepage!');
    console.log('Log in to see your delivered booking and leave a review!');

    process.exit(0);
  } catch (err) {
    console.error('❌ Setup failed:', err);
    process.exit(1);
  }
}

setup();
