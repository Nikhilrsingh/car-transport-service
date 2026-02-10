import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  const db = mongoose.connection.db;

  // Get any user and any booking from DB
  const users = await db.collection('users').find({}).limit(1).toArray();
  const bookings = await db.collection('bookings').find({}).limit(5).toArray();

  if (users.length === 0) {
    // Create a dummy user
    const result = await db.collection('users').insertOne({
      name: 'Rahul Sharma',
      email: 'rahul@test.com',
      password: '$2b$10$dummyhash',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    users.push({ _id: result.insertedId, name: 'Rahul Sharma' });
    console.log('Created dummy user');
  }

  const userId = users[0]._id;

  // Create dummy bookings if none exist
  if (bookings.length === 0) {
    for (let i = 0; i < 5; i++) {
      const result = await db.collection('bookings').insertOne({
        user: userId,
        customerId: userId,
        bookingReference: `SEED-REV-${Date.now()}-${i}`,
        fullName: 'Rahul Sharma',
        email: 'rahul@test.com',
        phone: '+919876543210',
        pickupCity: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune'][i],
        dropCity: ['Delhi', 'Bangalore', 'Chennai', 'Pune', 'Mumbai'][i],
        vehicleType: ['Sedan', 'SUV', 'Hatchback', 'Sedan', 'SUV'][i],
        status: 'delivered',
        pickupDate: new Date(Date.now() - (i + 3) * 24 * 60 * 60 * 1000),
        finalPrice: 10000 + i * 2000,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      bookings.push({ _id: result.insertedId });
    }
    console.log('Created 5 dummy bookings');
  }

  // Clear old reviews
  await db.collection('reviews').deleteMany({});

  const reviews = [
    { rating: 5, title: 'Excellent Service!', comment: 'The car transport service was exceptional. My vehicle arrived on time and in perfect condition. Highly recommend this service to everyone!' },
    { rating: 5, title: 'Very Professional Team', comment: 'Impressed by their professionalism and attention to detail. They handled my luxury car with great care. The tracking system was very helpful.' },
    { rating: 4, title: 'Great Experience Overall', comment: 'Good service with timely delivery. The pickup and drop-off were smooth. Would recommend to others looking for vehicle transport.' },
    { rating: 5, title: 'Best Car Transport Service', comment: 'Absolutely fantastic! They transported my SUV from Mumbai to Bangalore safely. The team was courteous and pricing was very reasonable.' },
    { rating: 4, title: 'Satisfied Customer', comment: 'The service met my expectations. My car was delivered without any scratches or damages. Simple booking process and good experience overall.' },
  ];

  const reviewDocs = reviews.map((r, i) => ({
    user: userId,
    booking: bookings[i % bookings.length]._id,
    rating: r.rating,
    title: r.title,
    comment: r.comment,
    isVerified: true,
    status: 'approved',
    helpfulCount: Math.floor(Math.random() * 15),
    createdAt: new Date(Date.now() - i * 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  }));

  await db.collection('reviews').insertMany(reviewDocs);
  console.log(`Inserted ${reviewDocs.length} reviews!`);

  // Verify
  const stats = await db.collection('reviews').countDocuments({ status: 'approved' });
  console.log(`Total approved reviews in DB: ${stats}`);

  await mongoose.connection.close();
  console.log('Done!');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
