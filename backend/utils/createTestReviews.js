/**
 * Create Test Reviews
 * Utility script to populate database with sample reviews for testing
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Review from '../models/review.model.js';
import User from '../models/User.model.js';
import Booking from '../models/booking.model.js';

dotenv.config();

const sampleReviews = [
  {
    rating: 5,
    title: 'Excellent Service!',
    comment: 'The car transport service was exceptional. My vehicle arrived on time and in perfect condition. The driver was professional and kept me updated throughout the journey. Highly recommend!'
  },
  {
    rating: 5,
    title: 'Very Professional Team',
    comment: 'I was impressed by their professionalism and attention to detail. They handled my luxury car with great care. The tracking system was very helpful. Will definitely use again!'
  },
  {
    rating: 4,
    title: 'Great Experience Overall',
    comment: 'Good service with timely delivery. The pickup and drop-off were smooth. The only minor issue was a slight delay in communication, but everything else was perfect. Would recommend to others.'
  },
  {
    rating: 5,
    title: 'Best Car Transport Service',
    comment: 'Absolutely fantastic service! They transported my SUV from Mumbai to Bangalore safely. The team was courteous and the pricing was very reasonable. Thank you for the wonderful service!'
  },
  {
    rating: 4,
    title: 'Satisfied Customer',
    comment: 'The service met my expectations. My car was delivered without any scratches or damages. The booking process was simple and straightforward. Happy with the overall experience.'
  },
  {
    rating: 5,
    title: 'Reliable and Trustworthy',
    comment: 'I had a great experience with this service. They were punctual, professional, and very careful with my vehicle. The price was competitive and there were no hidden charges. Excellent work!'
  },
  {
    rating: 5,
    title: 'Highly Recommended!',
    comment: 'Outstanding service from start to finish. The team was very responsive to my queries and the transport was completed ahead of schedule. My car arrived in pristine condition. Five stars!'
  },
  {
    rating: 4,
    title: 'Good Value for Money',
    comment: 'Decent service at a fair price. The transport was safe and the delivery was on time. Customer support could be slightly better, but overall I am satisfied with the service provided.'
  },
  {
    rating: 5,
    title: 'Smooth and Hassle-Free',
    comment: 'The entire process was smooth and hassle-free. From booking to delivery, everything was well-coordinated. The driver was friendly and professional. Will use this service again for sure!'
  },
  {
    rating: 5,
    title: 'Perfect Transport Service',
    comment: 'I cannot fault this service at all. They handled my vintage car with extreme care and delivered it safely to my new home. The insurance coverage gave me peace of mind. Truly excellent service!'
  }
];

async function createTestReviews() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find a user (or create a test user)
    let user = await User.findOne({ email: { $exists: true } });

    if (!user) {
      console.log('⚠️  No users found in database');
      console.log('Please create a user account first or run with existing user');
      process.exit(1);
    }

    console.log(`📧 Using user: ${user.email}`);

    // Find completed bookings for this user
    let bookings = await Booking.find({
      customerId: user._id,
      status: 'delivered'
    }).limit(sampleReviews.length);

    if (bookings.length === 0) {
      console.log('⚠️  No completed bookings found for this user');
      console.log('Please complete some bookings first or create test bookings');
      process.exit(1);
    }

    console.log(`📦 Found ${bookings.length} completed bookings`);

    // Delete existing reviews for these bookings
    await Review.deleteMany({
      user: user._id,
      booking: { $in: bookings.map(b => b._id) }
    });

    // Create reviews
    const reviewsToCreate = sampleReviews.slice(0, bookings.length).map((review, index) => ({
      user: user._id,
      booking: bookings[index]._id,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      isVerified: true,
      status: 'approved',
      helpfulCount: Math.floor(Math.random() * 20)
    }));

    const createdReviews = await Review.insertMany(reviewsToCreate);

    console.log(`\n✅ Successfully created ${createdReviews.length} test reviews!`);
    console.log('\n📊 Review Summary:');
    console.log(`   5 stars: ${createdReviews.filter(r => r.rating === 5).length}`);
    console.log(`   4 stars: ${createdReviews.filter(r => r.rating === 4).length}`);
    console.log(`   3 stars: ${createdReviews.filter(r => r.rating === 3).length}`);
    console.log(`   2 stars: ${createdReviews.filter(r => r.rating === 2).length}`);
    console.log(`   1 star:  ${createdReviews.filter(r => r.rating === 1).length}`);

    console.log('\n🎉 You can now test the review system!');
    console.log('   - Homepage: http://localhost:5500/frontend/index.html');
    console.log('   - Services: http://localhost:5500/frontend/services.html');
    console.log('   - Dashboard: http://localhost:5500/frontend/pages/dashboard.html');

  } catch (error) {
    console.error('❌ Error creating test reviews:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
}

createTestReviews();
