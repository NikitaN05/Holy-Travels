// Database seed script
// Creates sample data for development

import { PrismaClient, Role, TourStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.emergencyAlert.deleteMany();
  await prisma.itineraryItem.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.tourDate.deleteMany();
  await prisma.tour.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  console.log('📦 Cleared existing data');

  // Create Owner
  const ownerPassword = await bcrypt.hash('Owner@123', 12);
  const owner = await prisma.user.create({
    data: {
      email: 'owner@holytravels.com',
      passwordHash: ownerPassword,
      role: 'OWNER',
      fullName: 'Holy Travels Admin',
      displayName: 'Admin',
      phone: '+91-9876543210',
    },
  });
  console.log('👤 Created owner:', owner.email);

  // Create sample travellers
  const travellerPassword = await bcrypt.hash('Traveller@123', 12);
  const traveller1 = await prisma.user.create({
    data: {
      email: 'rahul@example.com',
      passwordHash: travellerPassword,
      role: 'TRAVELLER',
      fullName: 'Rahul Sharma',
      displayName: 'Rahul',
      phone: '+91-9876543211',
    },
  });

  const traveller2 = await prisma.user.create({
    data: {
      email: 'priya@example.com',
      passwordHash: travellerPassword,
      role: 'TRAVELLER',
      fullName: 'Priya Patel',
      displayName: 'Priya',
      phone: '+91-9876543212',
    },
  });
  console.log('👥 Created travellers');

  // Create Tours
  const charDham = await prisma.tour.create({
    data: {
      title: 'Char Dham Yatra',
      subtitle: 'The Ultimate Spiritual Journey',
      description: 'Embark on the sacred Char Dham Yatra covering Yamunotri, Gangotri, Kedarnath, and Badrinath. This divine pilgrimage takes you through the majestic Himalayas to the four sacred shrines.',
      durationDays: 12,
      price: 45000,
      currency: 'INR',
      locations: ['Yamunotri', 'Gangotri', 'Kedarnath', 'Badrinath', 'Haridwar', 'Rishikesh'],
      images: [
        'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1600',
        'https://images.unsplash.com/photo-1593181629936-11c609b8db9b?w=1600',
      ],
      highlights: [
        'Visit all four sacred Dhams',
        'Professional spiritual guide',
        'Comfortable accommodations',
        'All meals included',
        'Helicopter options available',
      ],
      inclusions: [
        'AC transport from Haridwar',
        'Hotel accommodation (3-star)',
        'All meals (veg)',
        'Temple darshan arrangements',
        'Travel insurance',
      ],
      exclusions: [
        'Personal expenses',
        'Pony/Palki charges',
        'Helicopter tickets',
        'Tips and gratuities',
      ],
      terms: 'Booking is subject to availability. 50% advance required. Cancellation charges apply.',
      maxGroupSize: 25,
      difficulty: 'challenging',
      category: 'pilgrimage',
      status: 'PUBLISHED',
      isFeatured: true,
    },
  });

  // Add tour dates for Char Dham
  const charDhamDate1 = await prisma.tourDate.create({
    data: {
      tourId: charDham.id,
      startDate: new Date('2025-05-01'),
      endDate: new Date('2025-05-12'),
      availableSpots: 25,
    },
  });

  await prisma.tourDate.create({
    data: {
      tourId: charDham.id,
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-06-12'),
      availableSpots: 25,
    },
  });

  // Add itinerary for Char Dham
  await prisma.itineraryItem.createMany({
    data: [
      {
        tourId: charDham.id,
        dayNumber: 1,
        title: 'Arrival at Haridwar',
        description: 'Arrive at Haridwar. Check-in to hotel. Evening Ganga Aarti at Har Ki Pauri.',
        location: 'Haridwar',
        sortOrder: 1,
      },
      {
        tourId: charDham.id,
        dayNumber: 2,
        title: 'Haridwar to Yamunotri',
        description: 'Drive to Janki Chatti (200 km). Trek or pony ride to Yamunotri Temple.',
        location: 'Yamunotri',
        sortOrder: 1,
      },
      {
        tourId: charDham.id,
        dayNumber: 3,
        title: 'Yamunotri to Uttarkashi',
        description: 'Return trek. Drive to Uttarkashi (100 km). Visit Vishwanath Temple.',
        location: 'Uttarkashi',
        sortOrder: 1,
      },
      {
        tourId: charDham.id,
        dayNumber: 4,
        title: 'Uttarkashi to Gangotri',
        description: 'Drive to Gangotri (100 km). Darshan at Gangotri Temple.',
        location: 'Gangotri',
        sortOrder: 1,
      },
      {
        tourId: charDham.id,
        dayNumber: 5,
        title: 'Gangotri to Guptkashi',
        description: 'Long drive to Guptkashi (220 km) via Uttarkashi.',
        location: 'Guptkashi',
        sortOrder: 1,
      },
      {
        tourId: charDham.id,
        dayNumber: 6,
        title: 'Kedarnath Darshan',
        description: 'Early morning trek to Kedarnath (16 km). Darshan at temple. Night stay near temple.',
        location: 'Kedarnath',
        notes: 'Carry warm clothes. Trek is strenuous.',
        isEmergencyRelevant: true,
        sortOrder: 1,
      },
      {
        tourId: charDham.id,
        dayNumber: 7,
        title: 'Kedarnath to Pipalkoti',
        description: 'Return trek. Drive to Pipalkoti (160 km).',
        location: 'Pipalkoti',
        sortOrder: 1,
      },
      {
        tourId: charDham.id,
        dayNumber: 8,
        title: 'Pipalkoti to Badrinath',
        description: 'Drive to Badrinath (75 km). Darshan at Badrinath Temple.',
        location: 'Badrinath',
        sortOrder: 1,
      },
      {
        tourId: charDham.id,
        dayNumber: 9,
        title: 'Badrinath to Rudraprayag',
        description: 'Morning darshan if needed. Drive to Rudraprayag (160 km).',
        location: 'Rudraprayag',
        sortOrder: 1,
      },
      {
        tourId: charDham.id,
        dayNumber: 10,
        title: 'Rudraprayag to Rishikesh',
        description: 'Drive to Rishikesh (140 km). Visit Ram Jhula, Laxman Jhula.',
        location: 'Rishikesh',
        sortOrder: 1,
      },
      {
        tourId: charDham.id,
        dayNumber: 11,
        title: 'Rishikesh Sightseeing',
        description: 'Visit ashrams, yoga sessions, river rafting (optional).',
        location: 'Rishikesh',
        sortOrder: 1,
      },
      {
        tourId: charDham.id,
        dayNumber: 12,
        title: 'Departure',
        description: 'Transfer to Haridwar/Dehradun for departure.',
        location: 'Haridwar',
        sortOrder: 1,
      },
    ],
  });

  // Create second tour - Varanasi
  const varanasi = await prisma.tour.create({
    data: {
      title: 'Varanasi Spiritual Experience',
      subtitle: 'The City of Light',
      description: 'Experience the spiritual essence of Varanasi - one of the oldest living cities in the world. Witness the famous Ganga Aarti, explore ancient temples, and discover the rich cultural heritage.',
      durationDays: 4,
      price: 15000,
      currency: 'INR',
      locations: ['Varanasi', 'Sarnath'],
      images: [
        'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1600',
        'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1600',
      ],
      highlights: [
        'Morning boat ride on Ganges',
        'Evening Ganga Aarti',
        'Kashi Vishwanath Temple',
        'Sarnath Buddhist site',
        'Local cuisine experience',
      ],
      inclusions: [
        'AC hotel stay',
        'All meals',
        'Local transport',
        'Guide services',
        'Boat rides',
      ],
      exclusions: [
        'Flights/trains',
        'Personal expenses',
        'Special pujas',
      ],
      maxGroupSize: 15,
      difficulty: 'easy',
      category: 'pilgrimage',
      status: 'PUBLISHED',
      isFeatured: true,
    },
  });

  await prisma.tourDate.create({
    data: {
      tourId: varanasi.id,
      startDate: new Date('2025-03-15'),
      endDate: new Date('2025-03-18'),
      availableSpots: 15,
    },
  });

  await prisma.itineraryItem.createMany({
    data: [
      {
        tourId: varanasi.id,
        dayNumber: 1,
        title: 'Arrival in Varanasi',
        description: 'Arrive at Varanasi. Check-in. Evening Ganga Aarti at Dashashwamedh Ghat.',
        location: 'Varanasi',
        sortOrder: 1,
      },
      {
        tourId: varanasi.id,
        dayNumber: 2,
        title: 'Ghats & Temples',
        description: 'Early morning boat ride. Visit Kashi Vishwanath Temple. Explore ghats.',
        location: 'Varanasi',
        sortOrder: 1,
      },
      {
        tourId: varanasi.id,
        dayNumber: 3,
        title: 'Sarnath Excursion',
        description: 'Day trip to Sarnath. Visit Dhamek Stupa, Ashoka Pillar, museum.',
        location: 'Sarnath',
        sortOrder: 1,
      },
      {
        tourId: varanasi.id,
        dayNumber: 4,
        title: 'Departure',
        description: 'Morning at leisure. Departure.',
        location: 'Varanasi',
        sortOrder: 1,
      },
    ],
  });

  console.log('🏛️ Created tours with itineraries');

  // Create a sample booking
  await prisma.booking.create({
    data: {
      userId: traveller1.id,
      tourDateId: charDhamDate1.id,
      status: 'CONFIRMED',
      numberOfTravellers: 2,
      totalAmount: 90000,
      contactName: 'Rahul Sharma',
      contactPhone: '+91-9876543211',
      contactEmail: 'rahul@example.com',
      confirmedAt: new Date(),
    },
  });

  console.log('📝 Created sample booking');

  // Create sample notifications
  await prisma.notification.create({
    data: {
      userId: traveller1.id,
      type: 'BOOKING_UPDATE',
      title: 'Booking Confirmed!',
      message: 'Your booking for Char Dham Yatra has been confirmed. Get ready for an amazing journey!',
      tourId: charDham.id,
    },
  });

  console.log('🔔 Created sample notifications');

  console.log('');
  console.log('✅ Seed completed successfully!');
  console.log('');
  console.log('📧 Login credentials:');
  console.log('   Owner: owner@holytravels.com / Owner@123');
  console.log('   Traveller: rahul@example.com / Traveller@123');
  console.log('   Traveller: priya@example.com / Traveller@123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

