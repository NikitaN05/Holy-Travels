/**
 * Database Seeder for Sacred Journeys
 * Run: node seed.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Models
const User = require('./models/User');
const Tour = require('./models/Tour');
const Menu = require('./models/Menu');
const Poll = require('./models/Poll');
const Gallery = require('./models/Gallery');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sacred_journeys';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Tour.deleteMany({});
    await Menu.deleteMany({});
    await Poll.deleteMany({});
    await Gallery.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create Admin User
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@sacredjourneys.com',
      password: adminPassword,
      phone: '9876543210',
      role: 'admin',
      isVerified: true
    });
    console.log('👤 Admin created: admin@sacredjourneys.com / admin123');

    // Create Sample User
    const userPassword = await bcrypt.hash('user123', 10);
    const user = await User.create({
      name: 'Ramesh Kumar',
      email: 'ramesh@example.com',
      password: userPassword,
      phone: '9123456789',
      role: 'user',
      isVerified: true
    });
    console.log('👤 User created: ramesh@example.com / user123');

    // ========================================
    // PILGRIMAGE TOURS
    // ========================================
    const pilgrimageTours = [
      {
        title: { 
          en: 'Char Dham Yatra - Complete Spiritual Circuit', 
          hi: 'चार धाम यात्रा - संपूर्ण आध्यात्मिक परिक्रमा', 
          mr: 'चार धाम यात्रा - संपूर्ण आध्यात्मिक परिक्रमा' 
        },
        slug: 'char-dham-yatra',
        description: { 
          en: 'Embark on the sacred Char Dham Yatra covering Yamunotri, Gangotri, Kedarnath, and Badrinath. This divine journey through the Himalayas offers spiritual liberation and breathtaking natural beauty. Experience ancient temples, holy rivers, and the serene atmosphere of Uttarakhand.',
          hi: 'यमुनोत्री, गंगोत्री, केदारनाथ और बद्रीनाथ को कवर करने वाली पवित्र चार धाम यात्रा पर निकलें। हिमालय के माध्यम से यह दिव्य यात्रा आध्यात्मिक मुक्ति और लुभावनी प्राकृतिक सुंदरता प्रदान करती है।',
          mr: 'यमुनोत्री, गंगोत्री, केदारनाथ आणि बद्रीनाथ या पवित्र चार धाम यात्रेला जा. हिमालयातून जाणारा हा दिव्य प्रवास आध्यात्मिक मुक्ती आणि नयनरम्य नैसर्गिक सौंदर्य देतो.'
        },
        shortDescription: {
          en: 'Complete spiritual circuit covering all four sacred dhams in Uttarakhand',
          hi: 'उत्तराखंड में सभी चार पवित्र धामों को कवर करने वाला संपूर्ण आध्यात्मिक परिक्रमा',
          mr: 'उत्तराखंडमधील सर्व चार पवित्र धामांचा संपूर्ण आध्यात्मिक परिक्रमा'
        },
        category: 'pilgrimage',
        duration: { days: 12, nights: 11 },
        price: { amount: 35000, currency: 'INR', discountedAmount: 32000 },
        startDates: [
          { date: new Date('2024-04-15'), availableSeats: 20, totalSeats: 25, status: 'upcoming' },
          { date: new Date('2024-05-01'), availableSeats: 25, totalSeats: 25, status: 'upcoming' },
          { date: new Date('2024-05-15'), availableSeats: 18, totalSeats: 25, status: 'upcoming' },
          { date: new Date('2024-06-01'), availableSeats: 25, totalSeats: 25, status: 'upcoming' }
        ],
        maxGroupSize: 25,
        difficulty: 'moderate',
        isActive: true,
        isFeatured: true,
        averageRating: 4.8,
        totalReviews: 156,
        images: [
          { url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', caption: 'Kedarnath Temple', isMain: true },
          { url: 'https://images.unsplash.com/photo-1593181520745-76e96c64a7ae?w=800', caption: 'Badrinath Temple' },
          { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', caption: 'Gangotri Himalayas' },
          { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800', caption: 'Yamunotri Mountains' },
          { url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800', caption: 'Ganga Aarti Haridwar' }
        ],
        departureLocation: { city: 'Delhi', station: 'ISBT Kashmiri Gate', address: 'Delhi' },
        itinerary: [
          { day: 1, title: 'Delhi to Haridwar', description: 'Morning departure from Delhi, reach Haridwar by evening, witness the mesmerizing Ganga Aarti at Har Ki Pauri' },
          { day: 2, title: 'Haridwar to Barkot', description: 'Drive to Barkot (200 km) via Dehradun and Mussoorie. Enroute visit Kempty Falls.' },
          { day: 3, title: 'Yamunotri Darshan', description: 'Trek to Yamunotri temple (6 km), take a holy dip in Surya Kund hot springs, darshan at Yamunotri Temple' },
          { day: 4, title: 'Barkot to Uttarkashi', description: 'Drive to Uttarkashi (100 km), visit the ancient Vishwanath Temple and Shakti Temple' },
          { day: 5, title: 'Gangotri Darshan', description: 'Drive to Gangotri (100 km), visit Gangotri Temple - the origin of River Ganga, Submerged Shivling' }
        ],
        inclusions: ['AC Deluxe Bus Transport', 'Hotel Accommodation (3-star)', 'Breakfast & Dinner Daily', 'Temple Darshan Assistance', 'Experienced Tour Guide', 'First Aid Kit', 'All Permits & Taxes'],
        exclusions: ['Helicopter Tickets', 'Pony/Palki Rides', 'Personal Expenses', 'Travel Insurance', 'Lunch', 'Tips & Gratitude'],
        highlights: [
          { en: 'Visit all four sacred Dhams', hi: 'सभी चार पवित्र धामों का दर्शन', mr: 'सर्व चार पवित्र धामांचे दर्शन' },
          { en: 'Ganga Aarti at Haridwar', hi: 'हरिद्वार में गंगा आरती', mr: 'हरिद्वार येथे गंगा आरती' },
          { en: 'Hot Springs at Yamunotri', hi: 'यमुनोत्री में गर्म पानी के कुंड', mr: 'यमुनोत्री येथील गरम पाण्याचे कुंड' }
        ],
        createdBy: admin._id
      },
      {
        title: { 
          en: 'Dwarka & Somnath Divine Darshan', 
          hi: 'द्वारका और सोमनाथ दिव्य दर्शन', 
          mr: 'द्वारका आणि सोमनाथ दिव्य दर्शन' 
        },
        slug: 'dwarka-somnath-darshan',
        description: { 
          en: 'Visit the legendary Dwarkadhish Temple, the ancient abode of Lord Krishna, and Somnath Temple, one of the 12 Jyotirlingas. Experience the divine coastal pilgrimage along the Arabian Sea with stunning sunsets and spiritual awakening.',
          hi: 'भगवान कृष्ण के प्राचीन निवास द्वारकाधीश मंदिर और 12 ज्योतिर्लिंगों में से एक सोमनाथ मंदिर के दर्शन करें। अरब सागर के किनारे इस दिव्य तीर्थयात्रा का अनुभव करें।',
          mr: 'भगवान कृष्णाचे प्राचीन निवासस्थान द्वारकाधीश मंदिर आणि 12 ज्योतिर्लिंगांपैकी एक सोमनाथ मंदिर यांना भेट द्या.'
        },
        shortDescription: {
          en: 'Sacred pilgrimage to Lord Krishna\'s Dwarka and the first Jyotirlinga at Somnath',
          hi: 'भगवान कृष्ण की द्वारका और सोमनाथ के पहले ज्योतिर्लिंग की पवित्र तीर्थयात्रा',
          mr: 'भगवान कृष्णाची द्वारका आणि सोमनाथचे पहिले ज्योतिर्लिंग यांची पवित्र तीर्थयात्रा'
        },
        category: 'pilgrimage',
        duration: { days: 6, nights: 5 },
        price: { amount: 18000, currency: 'INR', discountedAmount: 16500 },
        startDates: [
          { date: new Date('2024-03-20'), availableSeats: 28, totalSeats: 30, status: 'upcoming' },
          { date: new Date('2024-04-05'), availableSeats: 30, totalSeats: 30, status: 'upcoming' },
          { date: new Date('2024-04-20'), availableSeats: 25, totalSeats: 30, status: 'upcoming' }
        ],
        maxGroupSize: 30,
        difficulty: 'easy',
        isActive: true,
        isFeatured: true,
        averageRating: 4.7,
        totalReviews: 89,
        images: [
          { url: 'https://images.unsplash.com/photo-1609947017136-9daf32a71f67?w=800', caption: 'Somnath Temple', isMain: true },
          { url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800', caption: 'Dwarkadhish Temple' },
          { url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800', caption: 'Nageshwar Temple' },
          { url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800', caption: 'Bet Dwarka' },
          { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', caption: 'Arabian Sea Gujarat' }
        ],
        departureLocation: { city: 'Ahmedabad', station: 'Ahmedabad Railway Station', address: 'Gujarat' },
        itinerary: [
          { day: 1, title: 'Ahmedabad to Dwarka', description: 'Morning departure from Ahmedabad, scenic drive to Dwarka (450 km), evening Aarti at Dwarkadhish Temple' },
          { day: 2, title: 'Dwarka Darshan', description: 'Visit Dwarkadhish Temple, Rukmini Temple, Nageshwar Jyotirlinga, Gopi Talav, Bet Dwarka Island' },
          { day: 3, title: 'Dwarka to Somnath', description: 'Drive to Somnath (230 km), visit Bhalka Tirth enroute, evening Sound & Light Show at Somnath' },
          { day: 4, title: 'Somnath Darshan', description: 'Early morning Abhishek at Somnath Temple, visit Triveni Sangam, Panch Pandav Gufa, Junagadh' },
          { day: 5, title: 'Somnath to Ahmedabad', description: 'Visit Girnar Temples (optional), return journey to Ahmedabad' },
          { day: 6, title: 'Departure', description: 'Tour concludes, transfer to railway station/airport' }
        ],
        inclusions: ['AC Volvo Bus Transport', 'Hotel Accommodation', 'Morning Breakfast & Dinner', 'Temple Darshan Assistance', 'Guide Services', 'Boat Ride to Bet Dwarka'],
        exclusions: ['Flight/Train Tickets', 'Lunch', 'Personal Expenses', 'Camera Fees', 'Special Puja Arrangements'],
        createdBy: admin._id
      },
      {
        title: { 
          en: 'Tirupati Balaji VIP Darshan Package', 
          hi: 'तिरुपति बालाजी वीआईपी दर्शन पैकेज', 
          mr: 'तिरुपती बालाजी व्हीआयपी दर्शन पॅकेज' 
        },
        slug: 'tirupati-balaji-darshan',
        description: { 
          en: 'Experience divine darshan at the world\'s richest temple - Tirumala Tirupati Balaji. This VIP package includes special darshan tickets, comfortable stay at Tirumala, and visits to Padmavathi Temple and Srikalahasti.',
          hi: 'दुनिया के सबसे अमीर मंदिर - तिरुमाला तिरुपति बालाजी में दिव्य दर्शन का अनुभव करें। इस वीआईपी पैकेज में विशेष दर्शन टिकट और आरामदायक ठहराव शामिल है।',
          mr: 'जगातील सर्वात श्रीमंत मंदिर - तिरुमाला तिरुपती बालाजी येथे दिव्य दर्शनाचा अनुभव घ्या.'
        },
        shortDescription: {
          en: 'VIP Darshan at Sri Venkateswara Temple with premium accommodation',
          hi: 'श्री वेंकटेश्वर मंदिर में प्रीमियम आवास के साथ वीआईपी दर्शन',
          mr: 'प्रीमियम निवासासह श्री व्यंकटेश्वर मंदिरात व्हीआयपी दर्शन'
        },
        category: 'pilgrimage',
        duration: { days: 4, nights: 3 },
        price: { amount: 12000, currency: 'INR', discountedAmount: 10500 },
        startDates: [
          { date: new Date('2024-03-15'), availableSeats: 35, totalSeats: 40, status: 'upcoming' },
          { date: new Date('2024-03-22'), availableSeats: 40, totalSeats: 40, status: 'upcoming' },
          { date: new Date('2024-04-01'), availableSeats: 38, totalSeats: 40, status: 'upcoming' }
        ],
        maxGroupSize: 40,
        difficulty: 'easy',
        isActive: true,
        isFeatured: true,
        averageRating: 4.9,
        totalReviews: 234,
        images: [
          { url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800', caption: 'Tirumala Balaji Temple', isMain: true },
          { url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800', caption: 'Temple Gopuram' },
          { url: 'https://images.unsplash.com/photo-1609947017136-9daf32a71f67?w=800', caption: 'Padmavathi Temple' },
          { url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800', caption: 'Srikalahasti Temple' },
          { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', caption: 'Tirupati Hills' }
        ],
        departureLocation: { city: 'Chennai', station: 'Chennai Central', address: 'Tamil Nadu' },
        itinerary: [
          { day: 1, title: 'Chennai to Tirupati', description: 'Departure from Chennai, drive to Tirupati (150 km), visit Padmavathi Temple at Tiruchanur' },
          { day: 2, title: 'Tirumala Darshan', description: 'Early morning VIP darshan at Tirumala Venkateswara Temple, Tonsure if desired, Prasadam' },
          { day: 3, title: 'Srikalahasti Visit', description: 'Visit Srikalahasti Temple (one of Pancha Bhuta Sthalams), evening at leisure' },
          { day: 4, title: 'Return to Chennai', description: 'Morning departure, drop at Chennai railway station/airport' }
        ],
        inclusions: ['AC Transport', 'VIP Darshan Tickets', 'Hotel Stay', 'Breakfast & Dinner', 'Laddu Prasadam', 'Guide'],
        exclusions: ['Personal Puja Items', 'Donation to Temple', 'Tonsure Charges', 'Insurance'],
        createdBy: admin._id
      },
      {
        title: { 
          en: 'Ayodhya Ram Mandir Divine Yatra', 
          hi: 'अयोध्या राम मंदिर दिव्य यात्रा', 
          mr: 'अयोध्या राम मंदिर दिव्य यात्रा' 
        },
        slug: 'ayodhya-ram-mandir-yatra',
        description: { 
          en: 'Visit the magnificent newly built Ram Mandir in Ayodhya, the birthplace of Lord Rama. This spiritual journey covers Hanuman Garhi, Kanak Bhawan, Saryu Ghat, and other sacred sites in the holy city.',
          hi: 'भगवान राम की जन्मभूमि अयोध्या में नवनिर्मित भव्य राम मंदिर के दर्शन करें। यह आध्यात्मिक यात्रा हनुमान गढ़ी, कनक भवन, सरयू घाट और अन्य पवित्र स्थलों को कवर करती है।',
          mr: 'भगवान रामाची जन्मभूमी अयोध्येतील भव्य नवनिर्मित राम मंदिराला भेट द्या.'
        },
        shortDescription: {
          en: 'Visit the grand Ram Mandir and sacred sites of Ayodhya',
          hi: 'भव्य राम मंदिर और अयोध्या के पवित्र स्थलों का दर्शन',
          mr: 'भव्य राम मंदिर आणि अयोध्येच्या पवित्र स्थळांना भेट द्या'
        },
        category: 'pilgrimage',
        duration: { days: 3, nights: 2 },
        price: { amount: 8500, currency: 'INR', discountedAmount: 7500 },
        startDates: [
          { date: new Date('2024-03-10'), availableSeats: 45, totalSeats: 50, status: 'upcoming' },
          { date: new Date('2024-03-17'), availableSeats: 50, totalSeats: 50, status: 'upcoming' },
          { date: new Date('2024-03-24'), availableSeats: 42, totalSeats: 50, status: 'upcoming' },
          { date: new Date('2024-04-07'), availableSeats: 50, totalSeats: 50, status: 'upcoming' }
        ],
        maxGroupSize: 50,
        difficulty: 'easy',
        isActive: true,
        isFeatured: true,
        averageRating: 4.9,
        totalReviews: 312,
        images: [
          { url: 'https://images.unsplash.com/photo-1609947017136-9daf32a71f67?w=800', caption: 'Ram Mandir Ayodhya', isMain: true },
          { url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800', caption: 'Hanuman Garhi Temple' },
          { url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800', caption: 'Saryu River Ghat' },
          { url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800', caption: 'Kanak Bhawan' },
          { url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800', caption: 'Ram Ki Paidi' }
        ],
        departureLocation: { city: 'Lucknow', station: 'Lucknow Junction', address: 'Uttar Pradesh' },
        itinerary: [
          { day: 1, title: 'Lucknow to Ayodhya', description: 'Morning departure from Lucknow, reach Ayodhya, evening Saryu Aarti and Hanuman Garhi darshan' },
          { day: 2, title: 'Ram Mandir Darshan', description: 'Early morning darshan at Ram Janmabhoomi Mandir, visit Kanak Bhawan, Nageshwarnath Temple, Ramkatha Park' },
          { day: 3, title: 'Return Journey', description: 'Morning Saryu Snan, visit Tulsi Smarak Bhawan, return to Lucknow' }
        ],
        inclusions: ['AC Bus Transport', 'Hotel Accommodation', 'All Meals', 'Guided Temple Tours', 'Aarti Arrangements'],
        exclusions: ['Personal Puja', 'Shopping', 'Tips', 'Insurance'],
        createdBy: admin._id
      },
      {
        title: { 
          en: 'Mathura Vrindavan Krishna Bhakti Yatra', 
          hi: 'मथुरा वृंदावन कृष्ण भक्ति यात्रा', 
          mr: 'मथुरा वृंदावन कृष्ण भक्ती यात्रा' 
        },
        slug: 'mathura-vrindavan-yatra',
        description: { 
          en: 'Immerse yourself in Krishna consciousness with this divine journey to Mathura and Vrindavan. Visit Krishna Janmabhoomi, Banke Bihari Temple, Prem Mandir, ISKCON Temple, and experience the magical evening Aarti at Yamuna Ghat.',
          hi: 'मथुरा और वृंदावन की इस दिव्य यात्रा के साथ कृष्ण चेतना में डूबें। कृष्ण जन्मभूमि, बांके बिहारी मंदिर, प्रेम मंदिर, इस्कॉन मंदिर के दर्शन करें।',
          mr: 'मथुरा आणि वृंदावनच्या या दिव्य प्रवासाने कृष्ण चेतनेत बुडून जा.'
        },
        shortDescription: {
          en: 'Explore the divine land of Lord Krishna with temples and Yamuna Aarti',
          hi: 'भगवान कृष्ण की दिव्य भूमि का अन्वेषण करें',
          mr: 'भगवान कृष्णाच्या दिव्य भूमीचा शोध घ्या'
        },
        category: 'pilgrimage',
        duration: { days: 4, nights: 3 },
        price: { amount: 9500, currency: 'INR', discountedAmount: 8500 },
        startDates: [
          { date: new Date('2024-03-08'), availableSeats: 35, totalSeats: 40, status: 'upcoming' },
          { date: new Date('2024-03-22'), availableSeats: 40, totalSeats: 40, status: 'upcoming' },
          { date: new Date('2024-04-05'), availableSeats: 30, totalSeats: 40, status: 'upcoming' }
        ],
        maxGroupSize: 40,
        difficulty: 'easy',
        isActive: true,
        isFeatured: false,
        averageRating: 4.6,
        totalReviews: 178,
        images: [
          { url: 'https://images.unsplash.com/photo-1609947017136-9daf32a71f67?w=800', caption: 'Prem Mandir Vrindavan', isMain: true },
          { url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800', caption: 'Banke Bihari Temple', isMain: false },
          { url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800', caption: 'Krishna Janmabhoomi' },
          { url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800', caption: 'ISKCON Temple Vrindavan' },
          { url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800', caption: 'Yamuna Ghat' }
        ],
        departureLocation: { city: 'Delhi', station: 'ISBT Kashmiri Gate', address: 'Delhi' },
        itinerary: [
          { day: 1, title: 'Delhi to Mathura', description: 'Departure from Delhi, visit Mathura Krishna Janmabhoomi, Dwarkadhish Temple, evening at Vishram Ghat' },
          { day: 2, title: 'Vrindavan Temples', description: 'Visit Banke Bihari Temple, Radha Vallabh Temple, Nidhivan, evening at Prem Mandir light show' },
          { day: 3, title: 'More Temples', description: 'ISKCON Temple, Rangji Temple, Madan Mohan Temple, Keshi Ghat Aarti' },
          { day: 4, title: 'Return', description: 'Visit Goverdhan Parvat, Kusum Sarovar, return to Delhi' }
        ],
        inclusions: ['AC Volvo Transport', 'Hotel Stay', 'Breakfast & Dinner', 'Temple Guide', 'Yamuna Aarti'],
        exclusions: ['Lunch', 'Personal Puja', 'Boat Ride', 'Tips'],
        createdBy: admin._id
      },
      {
        title: { 
          en: 'Haridwar Rishikesh Ganga Aarti Tour', 
          hi: 'हरिद्वार ऋषिकेश गंगा आरती टूर', 
          mr: 'हरिद्वार ऋषिकेश गंगा आरती टूर' 
        },
        slug: 'haridwar-rishikesh-tour',
        description: { 
          en: 'Experience the spiritual energy of Haridwar and Rishikesh - the yoga capital of the world. Witness the grand Ganga Aarti, visit ancient temples, take a holy dip in the Ganges, and find inner peace at serene ashrams.',
          hi: 'हरिद्वार और ऋषिकेश - योग की विश्व राजधानी की आध्यात्मिक ऊर्जा का अनुभव करें। भव्य गंगा आरती देखें और गंगा में पवित्र स्नान करें।',
          mr: 'हरिद्वार आणि ऋषिकेश - जगाची योग राजधानी - च्या आध्यात्मिक ऊर्जेचा अनुभव घ्या.'
        },
        shortDescription: {
          en: 'Spiritual retreat at Ganga banks with yoga and meditation',
          hi: 'योग और ध्यान के साथ गंगा तट पर आध्यात्मिक विश्राम',
          mr: 'योग आणि ध्यानासह गंगा किनाऱ्यावर आध्यात्मिक विश्रांती'
        },
        category: 'pilgrimage',
        duration: { days: 4, nights: 3 },
        price: { amount: 8000, currency: 'INR', discountedAmount: 7000 },
        startDates: [
          { date: new Date('2024-03-15'), availableSeats: 30, totalSeats: 35, status: 'upcoming' },
          { date: new Date('2024-04-01'), availableSeats: 35, totalSeats: 35, status: 'upcoming' }
        ],
        maxGroupSize: 35,
        difficulty: 'easy',
        isActive: true,
        isFeatured: false,
        averageRating: 4.7,
        totalReviews: 145,
        images: [
          { url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800', caption: 'Ganga Aarti Har Ki Pauri', isMain: true },
          { url: 'https://images.unsplash.com/photo-1602508451498-d00a2ed89d00?w=800', caption: 'Laxman Jhula' },
          { url: 'https://images.unsplash.com/photo-1545126758-d68b8e9f6af7?w=800', caption: 'Ram Jhula' },
          { url: 'https://images.unsplash.com/photo-1609947017136-9daf32a71f67?w=800', caption: 'Mansa Devi Temple' },
          { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', caption: 'Ganges River Rishikesh' }
        ],
        departureLocation: { city: 'Delhi', station: 'ISBT Kashmiri Gate', address: 'Delhi' },
        itinerary: [
          { day: 1, title: 'Delhi to Haridwar', description: 'Morning departure, reach Haridwar, evening Ganga Aarti at Har Ki Pauri' },
          { day: 2, title: 'Haridwar Temples', description: 'Mansa Devi Temple (ropeway), Chandi Devi, Maya Devi Temple, explore Bara Bazaar' },
          { day: 3, title: 'Rishikesh Exploration', description: 'Visit Laxman Jhula, Ram Jhula, Triveni Ghat, Beatles Ashram, evening Aarti at Parmarth Niketan' },
          { day: 4, title: 'Return', description: 'Morning yoga session, Neelkanth Mahadev Temple visit (optional), return to Delhi' }
        ],
        inclusions: ['AC Transport', 'Hotel Stay', 'Meals', 'Ropeway Tickets', 'Guide'],
        exclusions: ['Adventure Activities', 'Personal Expenses', 'Rafting'],
        createdBy: admin._id
      },
      {
        title: { 
          en: 'Varanasi Spiritual Awakening Tour', 
          hi: 'वाराणसी आध्यात्मिक जागृति यात्रा', 
          mr: 'वाराणसी आध्यात्मिक जागृती यात्रा' 
        },
        slug: 'varanasi-spiritual-tour',
        description: { 
          en: 'Discover the mystical city of Varanasi - the oldest living city in the world. Experience the profound spirituality of Kashi with boat rides on Ganges at sunrise, the grand Ganga Aarti, visit to Kashi Vishwanath Temple, and the ancient ghats.',
          hi: 'वाराणसी के रहस्यमय शहर की खोज करें - दुनिया का सबसे पुराना जीवित शहर। सूर्योदय पर गंगा में नाव की सवारी के साथ काशी की गहन आध्यात्मिकता का अनुभव करें।',
          mr: 'वाराणसीचे रहस्यमय शहर शोधा - जगातील सर्वात जुने जिवंत शहर.'
        },
        shortDescription: {
          en: 'Experience the ancient spirituality of Kashi with Ganga Aarti',
          hi: 'गंगा आरती के साथ काशी की प्राचीन आध्यात्मिकता का अनुभव करें',
          mr: 'गंगा आरतीसह काशीच्या प्राचीन आध्यात्मिकतेचा अनुभव घ्या'
        },
        category: 'pilgrimage',
        duration: { days: 5, nights: 4 },
        price: { amount: 15000, currency: 'INR', discountedAmount: 13500 },
        startDates: [
          { date: new Date('2024-03-01'), availableSeats: 25, totalSeats: 30, status: 'upcoming' },
          { date: new Date('2024-03-15'), availableSeats: 30, totalSeats: 30, status: 'upcoming' },
          { date: new Date('2024-04-01'), availableSeats: 28, totalSeats: 30, status: 'upcoming' }
        ],
        maxGroupSize: 30,
        difficulty: 'easy',
        isActive: true,
        isFeatured: true,
        averageRating: 4.8,
        totalReviews: 198,
        images: [
          { url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800', caption: 'Varanasi Ghats Sunrise', isMain: true },
          { url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800', caption: 'Ganga Aarti Dashashwamedh' },
          { url: 'https://images.unsplash.com/photo-1609947017136-9daf32a71f67?w=800', caption: 'Kashi Vishwanath Temple' },
          { url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800', caption: 'Boat on Ganges' },
          { url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800', caption: 'Manikarnika Ghat' }
        ],
        departureLocation: { city: 'Delhi', station: 'New Delhi Railway Station', address: 'Delhi' },
        itinerary: [
          { day: 1, title: 'Arrival in Varanasi', description: 'Reach Varanasi, check-in hotel, evening Ganga Aarti at Dashashwamedh Ghat' },
          { day: 2, title: 'Sunrise Boat Ride', description: 'Early morning boat ride on Ganges, Kashi Vishwanath Temple, Annapurna Temple, Kaal Bhairav' },
          { day: 3, title: 'Temple Tour', description: 'Sankat Mochan Temple, BHU, Durga Temple, Tulsi Manas Temple, evening at Assi Ghat' },
          { day: 4, title: 'Sarnath Excursion', description: 'Day trip to Sarnath - where Buddha gave his first sermon, Dhamek Stupa, Museum' },
          { day: 5, title: 'Departure', description: 'Morning puja at ghats, shopping for Banarasi silk, departure' }
        ],
        inclusions: ['Train Tickets (2AC)', 'Hotel Accommodation', 'All Meals', 'Boat Rides', 'Temple Guide', 'Sarnath Excursion'],
        exclusions: ['Personal Puja Samagri', 'Shopping', 'Tips', 'Special Puja'],
        createdBy: admin._id
      },
      {
        title: { 
          en: 'Badrinath Kedarnath Do Dham Yatra', 
          hi: 'बद्रीनाथ केदारनाथ दो धाम यात्रा', 
          mr: 'बद्रीनाथ केदारनाथ दो धाम यात्रा' 
        },
        slug: 'badrinath-kedarnath-yatra',
        description: { 
          en: 'Embark on the divine Do Dham Yatra covering Kedarnath (one of 12 Jyotirlingas) and Badrinath (one of 4 Char Dhams). Trek through pristine Himalayan trails to reach these sacred abodes of Lord Shiva and Lord Vishnu.',
          hi: 'केदारनाथ (12 ज्योतिर्लिंगों में से एक) और बद्रीनाथ (4 चार धामों में से एक) को कवर करने वाली दिव्य दो धाम यात्रा पर निकलें।',
          mr: 'केदारनाथ (12 ज्योतिर्लिंगांपैकी एक) आणि बद्रीनाथ (4 चार धामांपैकी एक) समाविष्ट असलेल्या दिव्य दो धाम यात्रेला निघा.'
        },
        shortDescription: {
          en: 'Sacred pilgrimage to both Kedarnath and Badrinath temples',
          hi: 'केदारनाथ और बद्रीनाथ दोनों मंदिरों की पवित्र तीर्थयात्रा',
          mr: 'केदारनाथ आणि बद्रीनाथ या दोन्ही मंदिरांची पवित्र तीर्थयात्रा'
        },
        category: 'pilgrimage',
        duration: { days: 8, nights: 7 },
        price: { amount: 22000, currency: 'INR', discountedAmount: 19500 },
        startDates: [
          { date: new Date('2024-05-01'), availableSeats: 22, totalSeats: 25, status: 'upcoming' },
          { date: new Date('2024-05-15'), availableSeats: 25, totalSeats: 25, status: 'upcoming' },
          { date: new Date('2024-06-01'), availableSeats: 25, totalSeats: 25, status: 'upcoming' }
        ],
        maxGroupSize: 25,
        difficulty: 'moderate',
        isActive: true,
        isFeatured: false,
        averageRating: 4.8,
        totalReviews: 87,
        images: [
          { url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', caption: 'Kedarnath Temple Snow', isMain: true },
          { url: 'https://images.unsplash.com/photo-1593181520745-76e96c64a7ae?w=800', caption: 'Badrinath Temple' },
          { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800', caption: 'Himalayan Trek' },
          { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', caption: 'Mana Village' },
          { url: 'https://images.unsplash.com/photo-1545126758-d68b8e9f6af7?w=800', caption: 'Mandakini River' }
        ],
        departureLocation: { city: 'Delhi', station: 'ISBT Kashmiri Gate', address: 'Delhi' },
        itinerary: [
          { day: 1, title: 'Delhi to Haridwar', description: 'Morning departure, reach Haridwar, Ganga Aarti' },
          { day: 2, title: 'Haridwar to Guptkashi', description: 'Drive to Guptkashi via Devprayag, Rudraprayag' },
          { day: 3, title: 'Kedarnath Trek', description: 'Drive to Gaurikund, trek to Kedarnath (16 km)' },
          { day: 4, title: 'Kedarnath to Guptkashi', description: 'Early morning darshan, return trek to Guptkashi' },
          { day: 5, title: 'Guptkashi to Badrinath', description: 'Drive to Badrinath via Joshimath' },
          { day: 6, title: 'Badrinath Darshan', description: 'Mana Village, Vyas Gufa, Bhim Pul, temple darshan' },
          { day: 7, title: 'Badrinath to Rudraprayag', description: 'Return journey via scenic route' },
          { day: 8, title: 'Return to Delhi', description: 'Drive back to Delhi, tour concludes' }
        ],
        inclusions: ['AC Transport', 'Hotel Accommodation', 'All Meals', 'Trek Guide', 'Temple Assistance'],
        exclusions: ['Helicopter', 'Pony/Palki', 'Personal Expenses', 'Insurance'],
        createdBy: admin._id
      }
    ];

    // ========================================
    // HISTORIC TOURS
    // ========================================
    const historicTours = [
      {
        title: { 
          en: 'Agra Taj Mahal & Heritage Tour', 
          hi: 'आगरा ताज महल और विरासत यात्रा', 
          mr: 'आग्रा ताज महाल आणि वारसा यात्रा' 
        },
        slug: 'agra-taj-mahal-tour',
        description: { 
          en: 'Witness the epitome of Mughal architecture - the magnificent Taj Mahal. This heritage tour covers Agra Fort, Itmad-ud-Daulah (Baby Taj), Mehtab Bagh for sunset views, and the bustling markets of Agra.',
          hi: 'मुगल वास्तुकला का शिखर देखें - भव्य ताज महल। इस विरासत यात्रा में आगरा का किला, इत्माद-उद-दौला (बेबी ताज), मेहताब बाग शामिल हैं।',
          mr: 'मुघल वास्तुकलेचे शिखर पहा - भव्य ताजमहाल. या वारसा यात्रेत आग्रा किल्ला, इत्माद-उद-दौला यांचा समावेश आहे.'
        },
        shortDescription: {
          en: 'Marvel at the Taj Mahal and explore Mughal heritage sites',
          hi: 'ताज महल का आनंद लें और मुगल विरासत स्थलों का अन्वेषण करें',
          mr: 'ताजमहालचा आनंद घ्या आणि मुघल वारसा स्थळांचा शोध घ्या'
        },
        category: 'historic',
        duration: { days: 2, nights: 1 },
        price: { amount: 5500, currency: 'INR', discountedAmount: 4800 },
        startDates: [
          { date: new Date('2024-03-09'), availableSeats: 38, totalSeats: 40, status: 'upcoming' },
          { date: new Date('2024-03-16'), availableSeats: 40, totalSeats: 40, status: 'upcoming' },
          { date: new Date('2024-03-23'), availableSeats: 35, totalSeats: 40, status: 'upcoming' },
          { date: new Date('2024-03-30'), availableSeats: 40, totalSeats: 40, status: 'upcoming' }
        ],
        maxGroupSize: 40,
        difficulty: 'easy',
        isActive: true,
        isFeatured: true,
        averageRating: 4.7,
        totalReviews: 287,
        images: [
          { url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800', caption: 'Taj Mahal', isMain: true },
          { url: 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=800', caption: 'Agra Fort' },
          { url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800', caption: 'Itmad ud Daulah' },
          { url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800', caption: 'Mehtab Bagh' },
          { url: 'https://images.unsplash.com/photo-1515091943-9d5c0ad475af?w=800', caption: 'Taj Mahal Gardens' }
        ],
        departureLocation: { city: 'Delhi', station: 'ISBT Kashmiri Gate', address: 'Delhi' },
        itinerary: [
          { day: 1, title: 'Delhi to Agra', description: 'Early morning departure via Yamuna Expressway, visit Taj Mahal at sunrise, Agra Fort, Mehtab Bagh sunset' },
          { day: 2, title: 'More Agra & Return', description: 'Itmad-ud-Daulah, Akbar Tomb at Sikandra, local bazaar for marble souvenirs, return to Delhi' }
        ],
        inclusions: ['AC Volvo Transport', 'Hotel Stay', 'Breakfast', 'Monument Entry Tickets', 'Guide Service'],
        exclusions: ['Lunch/Dinner', 'Camera Fees', 'Personal Shopping', 'Tips'],
        createdBy: admin._id
      },
      {
        title: { 
          en: 'Delhi Heritage Walk & Monuments Tour', 
          hi: 'दिल्ली विरासत पैदल यात्रा और स्मारक टूर', 
          mr: 'दिल्ली वारसा पदयात्रा आणि स्मारक टूर' 
        },
        slug: 'delhi-heritage-tour',
        description: { 
          en: 'Explore the rich history of Delhi from Mughal era to British Raj. Visit Red Fort, Qutub Minar, Humayun\'s Tomb, India Gate, and experience Old Delhi\'s charm through heritage walks in Chandni Chowk.',
          hi: 'मुगल काल से ब्रिटिश राज तक दिल्ली के समृद्ध इतिहास का अन्वेषण करें। लाल किला, कुतुब मीनार, हुमायूं का मकबरा, इंडिया गेट देखें।',
          mr: 'मुघल काळापासून ब्रिटिश राजवटीपर्यंत दिल्लीचा समृद्ध इतिहास एक्सप्लोर करा.'
        },
        shortDescription: {
          en: 'Discover 1000 years of Delhi\'s glorious history',
          hi: 'दिल्ली के 1000 वर्षों के गौरवशाली इतिहास की खोज करें',
          mr: 'दिल्लीच्या 1000 वर्षांच्या गौरवशाली इतिहासाचा शोध घ्या'
        },
        category: 'historic',
        duration: { days: 2, nights: 1 },
        price: { amount: 4500, currency: 'INR', discountedAmount: 3900 },
        startDates: [
          { date: new Date('2024-03-08'), availableSeats: 28, totalSeats: 30, status: 'upcoming' },
          { date: new Date('2024-03-15'), availableSeats: 30, totalSeats: 30, status: 'upcoming' },
          { date: new Date('2024-03-22'), availableSeats: 25, totalSeats: 30, status: 'upcoming' }
        ],
        maxGroupSize: 30,
        difficulty: 'easy',
        isActive: true,
        isFeatured: false,
        averageRating: 4.5,
        totalReviews: 156,
        images: [
          { url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', caption: 'Red Fort Delhi', isMain: true },
          { url: 'https://images.unsplash.com/photo-1597040663342-45b6af3d91a5?w=800', caption: 'Qutub Minar' },
          { url: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=800', caption: 'India Gate' },
          { url: 'https://images.unsplash.com/photo-1586788224331-947f68671cf1?w=800', caption: 'Humayun Tomb' },
          { url: 'https://images.unsplash.com/photo-1595928642949-ccab6c2f837a?w=800', caption: 'Lotus Temple' }
        ],
        departureLocation: { city: 'Delhi', station: 'Connaught Place', address: 'Delhi' },
        itinerary: [
          { day: 1, title: 'Old Delhi', description: 'Red Fort, Jama Masjid, Chandni Chowk heritage walk, Raj Ghat, evening at India Gate' },
          { day: 2, title: 'New Delhi & South', description: 'Qutub Minar, Humayun Tomb, Lotus Temple, Akshardham (evening show)' }
        ],
        inclusions: ['AC Vehicle', 'Hotel Stay', 'Breakfast', 'Entry Tickets', 'Guide', 'Rickshaw Ride in Chandni Chowk'],
        exclusions: ['Lunch/Dinner', 'Personal Expenses', 'Akshardham Show Tickets'],
        createdBy: admin._id
      },
      {
        title: { 
          en: 'Jaipur Pink City Royal Heritage Tour', 
          hi: 'जयपुर पिंक सिटी रॉयल हेरिटेज टूर', 
          mr: 'जयपूर पिंक सिटी रॉयल हेरिटेज टूर' 
        },
        slug: 'jaipur-heritage-tour',
        description: { 
          en: 'Experience the royal grandeur of Jaipur - the Pink City. Visit the majestic Amber Fort, City Palace, Hawa Mahal, Jantar Mantar, and Nahargarh Fort. Enjoy elephant rides and Rajasthani cuisine.',
          hi: 'जयपुर - पिंक सिटी की शाही भव्यता का अनुभव करें। आमेर किला, सिटी पैलेस, हवा महल, जंतर मंतर और नाहरगढ़ किला देखें।',
          mr: 'जयपूर - पिंक सिटीच्या शाही भव्यतेचा अनुभव घ्या. आमेर किल्ला, सिटी पॅलेस, हवा महाल पहा.'
        },
        shortDescription: {
          en: 'Explore magnificent forts and palaces of the Pink City',
          hi: 'पिंक सिटी के भव्य किलों और महलों का अन्वेषण करें',
          mr: 'पिंक सिटीच्या भव्य किल्ले आणि महालांचा शोध घ्या'
        },
        category: 'historic',
        duration: { days: 3, nights: 2 },
        price: { amount: 8500, currency: 'INR', discountedAmount: 7500 },
        startDates: [
          { date: new Date('2024-03-10'), availableSeats: 32, totalSeats: 35, status: 'upcoming' },
          { date: new Date('2024-03-17'), availableSeats: 35, totalSeats: 35, status: 'upcoming' },
          { date: new Date('2024-03-24'), availableSeats: 30, totalSeats: 35, status: 'upcoming' }
        ],
        maxGroupSize: 35,
        difficulty: 'easy',
        isActive: true,
        isFeatured: true,
        averageRating: 4.8,
        totalReviews: 223,
        images: [
          { url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800', caption: 'Amber Fort', isMain: true },
          { url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800', caption: 'Hawa Mahal' },
          { url: 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=800', caption: 'City Palace Jaipur' },
          { url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800', caption: 'Jantar Mantar' },
          { url: 'https://images.unsplash.com/photo-1524230507669-5ff97982bb5e?w=800', caption: 'Jal Mahal' }
        ],
        departureLocation: { city: 'Delhi', station: 'ISBT Kashmiri Gate', address: 'Delhi' },
        itinerary: [
          { day: 1, title: 'Delhi to Jaipur', description: 'Morning departure, reach Jaipur by afternoon, evening at Nahargarh Fort sunset point' },
          { day: 2, title: 'Jaipur Sightseeing', description: 'Amber Fort (elephant ride), City Palace, Jantar Mantar, Hawa Mahal, local bazaar' },
          { day: 3, title: 'Return', description: 'Albert Hall Museum, Birla Temple, return to Delhi via expressway' }
        ],
        inclusions: ['AC Bus', 'Hotel (3-star)', 'Breakfast & Dinner', 'Entry Tickets', 'Elephant Ride', 'Guide'],
        exclusions: ['Lunch', 'Shopping', 'Personal Expenses', 'Camera Fees'],
        createdBy: admin._id
      },
      {
        title: { 
          en: 'Ajanta Ellora Caves World Heritage Tour', 
          hi: 'अजंता एलोरा गुफाएं विश्व विरासत यात्रा', 
          mr: 'अजंता एलोरा लेणी जागतिक वारसा यात्रा' 
        },
        slug: 'ajanta-ellora-heritage',
        description: { 
          en: 'Explore the UNESCO World Heritage sites of Ajanta and Ellora caves featuring stunning Buddhist, Hindu, and Jain rock-cut temples. Marvel at the ancient paintings and architecture dating back to 2nd century BCE.',
          hi: 'अजंता और एलोरा गुफाओं के यूनेस्को विश्व धरोहर स्थलों का अन्वेषण करें जिनमें बौद्ध, हिंदू और जैन रॉक-कट मंदिर हैं।',
          mr: 'अजंता आणि एलोरा लेण्यांच्या युनेस्को जागतिक वारसा स्थळांचा शोध घ्या.'
        },
        shortDescription: {
          en: 'Ancient rock-cut caves with stunning Buddhist & Hindu art',
          hi: 'बौद्ध और हिंदू कला के साथ प्राचीन रॉक-कट गुफाएं',
          mr: 'बौद्ध आणि हिंदू कलेसह प्राचीन रॉक-कट लेण्या'
        },
        category: 'historic',
        duration: { days: 4, nights: 3 },
        price: { amount: 12000, currency: 'INR', discountedAmount: 10500 },
        startDates: [
          { date: new Date('2024-02-15'), availableSeats: 18, totalSeats: 20, status: 'upcoming' },
          { date: new Date('2024-03-01'), availableSeats: 20, totalSeats: 20, status: 'upcoming' },
          { date: new Date('2024-03-15'), availableSeats: 15, totalSeats: 20, status: 'upcoming' }
        ],
        maxGroupSize: 20,
        difficulty: 'easy',
        isActive: true,
        isFeatured: true,
        averageRating: 4.6,
        totalReviews: 134,
        images: [
          { url: 'https://images.unsplash.com/photo-1590766940554-634931b7f9fe?w=800', caption: 'Ajanta Caves', isMain: true },
          { url: 'https://images.unsplash.com/photo-1606298246186-726f2f3a2da7?w=800', caption: 'Ellora Kailasa Temple' },
          { url: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=800', caption: 'Cave Paintings' },
          { url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800', caption: 'Buddha Statue' },
          { url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800', caption: 'Bibi Ka Maqbara' }
        ],
        departureLocation: { city: 'Mumbai', station: 'Mumbai CST', address: 'Maharashtra' },
        itinerary: [
          { day: 1, title: 'Mumbai to Aurangabad', description: 'Flight to Aurangabad, visit Bibi Ka Maqbara (Mini Taj), evening at leisure' },
          { day: 2, title: 'Ellora Caves', description: 'Full day exploring Ellora Caves - Cave 16 (Kailasa Temple), Buddhist and Jain caves' },
          { day: 3, title: 'Ajanta Caves', description: 'Drive to Ajanta (100 km), explore all 30 caves with ancient paintings and sculptures' },
          { day: 4, title: 'Return', description: 'Visit Daulatabad Fort, flight back to Mumbai' }
        ],
        inclusions: ['Flight Tickets', 'Hotel Stay', 'All Meals', 'AC Vehicle', 'Entry Tickets', 'Expert Guide'],
        exclusions: ['Personal Expenses', 'Camera Fees', 'Tips', 'Extra Sightseeing'],
        createdBy: admin._id
      },
      {
        title: { 
          en: 'Fatehpur Sikri & Jodha Bai Palace Heritage Walk', 
          hi: 'फतेहपुर सीकरी और जोधा बाई पैलेस हेरिटेज वॉक', 
          mr: 'फतेहपूर सिक्री आणि जोधा बाई पॅलेस हेरिटेज वॉक' 
        },
        slug: 'fatehpur-sikri-tour',
        description: { 
          en: 'Step back into the Mughal era at Fatehpur Sikri, the abandoned capital city of Emperor Akbar. Explore Buland Darwaza, Jama Masjid, Jodha Bai Palace, Panch Mahal, and the tomb of Salim Chishti.',
          hi: 'सम्राट अकबर की परित्यक्त राजधानी फतेहपुर सीकरी में मुगल युग में वापस जाएं। बुलंद दरवाजा, जामा मस्जिद, जोधा बाई पैलेस का अन्वेषण करें।',
          mr: 'सम्राट अकबराची सोडलेली राजधानी फतेहपूर सिक्री येथे मुघल युगात परत जा.'
        },
        shortDescription: {
          en: 'Explore Akbar\'s magnificent abandoned capital city',
          hi: 'अकबर की भव्य परित्यक्त राजधानी का अन्वेषण करें',
          mr: 'अकबराच्या भव्य सोडलेल्या राजधानीचा शोध घ्या'
        },
        category: 'historic',
        duration: { days: 1, nights: 0 },
        price: { amount: 2500, currency: 'INR', discountedAmount: 2200 },
        startDates: [
          { date: new Date('2024-03-10'), availableSeats: 40, totalSeats: 45, status: 'upcoming' },
          { date: new Date('2024-03-17'), availableSeats: 45, totalSeats: 45, status: 'upcoming' },
          { date: new Date('2024-03-24'), availableSeats: 42, totalSeats: 45, status: 'upcoming' }
        ],
        maxGroupSize: 45,
        difficulty: 'easy',
        isActive: true,
        isFeatured: false,
        averageRating: 4.4,
        totalReviews: 98,
        images: [
          { url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800', caption: 'Buland Darwaza', isMain: true },
          { url: 'https://images.unsplash.com/photo-1515091943-9d5c0ad475af?w=800', caption: 'Panch Mahal' },
          { url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800', caption: 'Jodha Bai Palace' },
          { url: 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=800', caption: 'Salim Chishti Dargah' },
          { url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800', caption: 'Diwan i Khas' }
        ],
        departureLocation: { city: 'Agra', station: 'Agra Cantt', address: 'Uttar Pradesh' },
        itinerary: [
          { day: 1, title: 'Fatehpur Sikri Day Trip', description: 'Morning departure from Agra, full day exploring Fatehpur Sikri complex - Buland Darwaza, Diwan-i-Khas, Panch Mahal, Jodha Bai Palace, Salim Chishti Dargah, return by evening' }
        ],
        inclusions: ['AC Vehicle', 'Entry Tickets', 'Guide', 'Water Bottle'],
        exclusions: ['Meals', 'Personal Expenses', 'Tips'],
        createdBy: admin._id
      },
      {
        title: { 
          en: 'Golden Triangle Delhi-Agra-Jaipur Tour', 
          hi: 'गोल्डन ट्राएंगल दिल्ली-आगरा-जयपुर टूर', 
          mr: 'गोल्डन ट्रायंगल दिल्ली-आग्रा-जयपूर टूर' 
        },
        slug: 'golden-triangle-tour',
        description: { 
          en: 'India\'s most iconic heritage circuit covering three historic cities. Experience the Mughal grandeur of Delhi & Agra and the royal Rajput heritage of Jaipur. Visit Taj Mahal, Red Fort, Amber Fort, and more.',
          hi: 'भारत का सबसे प्रतिष्ठित विरासत सर्किट जो तीन ऐतिहासिक शहरों को कवर करता है। दिल्ली और आगरा की मुगल भव्यता और जयपुर की शाही राजपूत विरासत का अनुभव करें।',
          mr: 'भारताचे सर्वात प्रतिष्ठित वारसा सर्किट जे तीन ऐतिहासिक शहरे कव्हर करते.'
        },
        shortDescription: {
          en: 'India\'s most popular heritage circuit with iconic monuments',
          hi: 'प्रतिष्ठित स्मारकों के साथ भारत का सबसे लोकप्रिय विरासत सर्किट',
          mr: 'प्रतिष्ठित स्मारकांसह भारताचे सर्वात लोकप्रिय वारसा सर्किट'
        },
        category: 'historic',
        duration: { days: 6, nights: 5 },
        price: { amount: 18000, currency: 'INR', discountedAmount: 15500 },
        startDates: [
          { date: new Date('2024-03-05'), availableSeats: 28, totalSeats: 30, status: 'upcoming' },
          { date: new Date('2024-03-12'), availableSeats: 30, totalSeats: 30, status: 'upcoming' },
          { date: new Date('2024-03-19'), availableSeats: 25, totalSeats: 30, status: 'upcoming' },
          { date: new Date('2024-03-26'), availableSeats: 30, totalSeats: 30, status: 'upcoming' }
        ],
        maxGroupSize: 30,
        difficulty: 'easy',
        isActive: true,
        isFeatured: true,
        averageRating: 4.9,
        totalReviews: 345,
        images: [
          { url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800', caption: 'Taj Mahal Agra', isMain: true },
          { url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800', caption: 'Amber Fort Jaipur' },
          { url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', caption: 'Red Fort Delhi' },
          { url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800', caption: 'Hawa Mahal' },
          { url: 'https://images.unsplash.com/photo-1597040663342-45b6af3d91a5?w=800', caption: 'Qutub Minar' },
          { url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800', caption: 'Fatehpur Sikri' }
        ],
        departureLocation: { city: 'Delhi', station: 'Delhi Airport/Hotel Pickup', address: 'Delhi' },
        itinerary: [
          { day: 1, title: 'Delhi Arrival', description: 'Arrival in Delhi, check-in hotel, evening at leisure or India Gate visit' },
          { day: 2, title: 'Delhi Sightseeing', description: 'Red Fort, Jama Masjid, Chandni Chowk, Qutub Minar, Humayun Tomb' },
          { day: 3, title: 'Delhi to Agra', description: 'Drive to Agra, afternoon Agra Fort, evening Taj Mahal at sunset' },
          { day: 4, title: 'Agra to Jaipur', description: 'Sunrise Taj Mahal, drive to Jaipur via Fatehpur Sikri' },
          { day: 5, title: 'Jaipur Sightseeing', description: 'Amber Fort, City Palace, Hawa Mahal, Jantar Mantar, local markets' },
          { day: 6, title: 'Departure', description: 'Drive back to Delhi airport/station for departure' }
        ],
        inclusions: ['AC Deluxe Vehicle', 'Hotels (4-star)', 'Breakfast & Dinner', 'All Entry Tickets', 'Expert Guide', 'Airport Transfers'],
        exclusions: ['Flight/Train Tickets', 'Lunch', 'Personal Expenses', 'Camera Fees', 'Tips'],
        createdBy: admin._id
      }
    ];

    // ========================================
    // MIXED TOURS (Pilgrimage + Historic)
    // ========================================
    const mixedTours = [
      {
        title: { 
          en: 'Varanasi & Sarnath Spiritual Heritage Tour', 
          hi: 'वाराणसी और सारनाथ आध्यात्मिक विरासत यात्रा', 
          mr: 'वाराणसी आणि सारनाथ आध्यात्मिक वारसा यात्रा' 
        },
        slug: 'varanasi-sarnath-heritage',
        description: { 
          en: 'Combine the spiritual essence of Varanasi with the Buddhist heritage of Sarnath. Experience Ganga Aarti, ancient temples, and the place where Buddha delivered his first sermon after enlightenment.',
          hi: 'वाराणसी की आध्यात्मिक सार को सारनाथ की बौद्ध विरासत के साथ मिलाएं। गंगा आरती, प्राचीन मंदिरों और बुद्ध के पहले उपदेश स्थल का अनुभव करें।',
          mr: 'वाराणसीच्या आध्यात्मिक साराला सारनाथच्या बौद्ध वारशासोबत एकत्र करा.'
        },
        shortDescription: {
          en: 'Hindu spirituality meets Buddhist heritage in this unique tour',
          hi: 'इस अनूठी यात्रा में हिंदू आध्यात्मिकता बौद्ध विरासत से मिलती है',
          mr: 'या अनोख्या यात्रेत हिंदू आध्यात्मिकता बौद्ध वारशाला भेटते'
        },
        category: 'mixed',
        duration: { days: 5, nights: 4 },
        price: { amount: 14000, currency: 'INR', discountedAmount: 12500 },
        startDates: [
          { date: new Date('2024-03-10'), availableSeats: 25, totalSeats: 28, status: 'upcoming' },
          { date: new Date('2024-03-20'), availableSeats: 28, totalSeats: 28, status: 'upcoming' }
        ],
        maxGroupSize: 28,
        difficulty: 'easy',
        isActive: true,
        isFeatured: false,
        averageRating: 4.7,
        totalReviews: 112,
        images: [
          { url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800', caption: 'Varanasi Ghats', isMain: true },
          { url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800', caption: 'Boat Ganges' },
          { url: 'https://images.unsplash.com/photo-1609947017136-9daf32a71f67?w=800', caption: 'Ganga Aarti' },
          { url: 'https://images.unsplash.com/photo-1590766940554-634931b7f9fe?w=800', caption: 'Dhamek Stupa Sarnath' },
          { url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800', caption: 'Ashoka Pillar' }
        ],
        departureLocation: { city: 'Delhi', station: 'New Delhi Railway Station', address: 'Delhi' },
        itinerary: [
          { day: 1, title: 'Delhi to Varanasi', description: 'Train/flight to Varanasi, evening Ganga Aarti' },
          { day: 2, title: 'Varanasi Temples', description: 'Sunrise boat ride, Kashi Vishwanath, temple tour' },
          { day: 3, title: 'Sarnath', description: 'Full day at Sarnath - Dhamek Stupa, Ashoka Pillar, Museum' },
          { day: 4, title: 'More Varanasi', description: 'Explore more ghats, silk weaving, evening aarti' },
          { day: 5, title: 'Return', description: 'Morning at ghats, return to Delhi' }
        ],
        inclusions: ['Train Tickets (2AC)', 'Hotel', 'All Meals', 'Boat Rides', 'Guide', 'Entry Tickets'],
        exclusions: ['Personal Puja', 'Shopping', 'Tips'],
        createdBy: admin._id
      },
      {
        title: { 
          en: 'Rajasthan Temples & Forts Grand Tour', 
          hi: 'राजस्थान मंदिर और किले ग्रैंड टूर', 
          mr: 'राजस्थान मंदिरे आणि किल्ले ग्रँड टूर' 
        },
        slug: 'rajasthan-temples-forts-tour',
        description: { 
          en: 'A comprehensive journey through Rajasthan covering the sacred temples of Pushkar, Nathdwara, and Ranakpur along with magnificent forts of Udaipur, Jodhpur, and Jaisalmer.',
          hi: 'राजस्थान की एक व्यापक यात्रा जिसमें पुष्कर, नाथद्वारा और रणकपुर के पवित्र मंदिर और उदयपुर, जोधपुर और जैसलमेर के भव्य किले शामिल हैं।',
          mr: 'राजस्थानमधून एक सर्वसमावेशक प्रवास ज्यात पुष्कर, नाथद्वारा आणि रणकपुरची पवित्र मंदिरे आणि उदयपूर, जोधपूर आणि जैसलमेरचे भव्य किल्ले समाविष्ट आहेत.'
        },
        shortDescription: {
          en: 'Sacred temples and royal forts of Rajasthan in one grand tour',
          hi: 'एक भव्य यात्रा में राजस्थान के पवित्र मंदिर और शाही किले',
          mr: 'एका भव्य यात्रेत राजस्थानची पवित्र मंदिरे आणि शाही किल्ले'
        },
        category: 'mixed',
        duration: { days: 10, nights: 9 },
        price: { amount: 35000, currency: 'INR', discountedAmount: 32000 },
        startDates: [
          { date: new Date('2024-03-15'), availableSeats: 22, totalSeats: 25, status: 'upcoming' },
          { date: new Date('2024-04-01'), availableSeats: 25, totalSeats: 25, status: 'upcoming' }
        ],
        maxGroupSize: 25,
        difficulty: 'easy',
        isActive: true,
        isFeatured: true,
        averageRating: 4.8,
        totalReviews: 89,
        images: [
          { url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800', caption: 'Lake Pichola Udaipur', isMain: true },
          { url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800', caption: 'City Palace Udaipur' },
          { url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800', caption: 'Jaisalmer Fort' },
          { url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800', caption: 'Mehrangarh Fort Jodhpur' },
          { url: 'https://images.unsplash.com/photo-1524230507669-5ff97982bb5e?w=800', caption: 'Pushkar Lake' },
          { url: 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=800', caption: 'Ranakpur Jain Temple' }
        ],
        departureLocation: { city: 'Delhi', station: 'Delhi Airport', address: 'Delhi' },
        itinerary: [
          { day: 1, title: 'Delhi to Jaipur', description: 'Flight to Jaipur, afternoon city tour' },
          { day: 2, title: 'Jaipur Forts', description: 'Amber Fort, City Palace, Jantar Mantar' },
          { day: 3, title: 'Jaipur to Pushkar', description: 'Drive to holy city of Pushkar, Brahma Temple' },
          { day: 4, title: 'Pushkar to Udaipur', description: 'Drive via Nathdwara Temple, reach Udaipur' },
          { day: 5, title: 'Udaipur', description: 'City Palace, Lake Pichola boat ride, Jagdish Temple' }
        ],
        inclusions: ['Flights/Train', 'Hotels (4-star)', 'All Meals', 'AC Vehicle', 'All Entry Tickets', 'Expert Guide'],
        exclusions: ['Camel Safari', 'Personal Expenses', 'Tips', 'Special Activities'],
        createdBy: admin._id
      }
    ];

    // Combine all tours and insert
    const allTours = [...pilgrimageTours, ...historicTours, ...mixedTours];
    const tours = await Tour.insertMany(allTours);
    console.log(`🛕 Created ${tours.length} tours (${pilgrimageTours.length} pilgrimage, ${historicTours.length} historic, ${mixedTours.length} mixed)`);

    // Create Sample Menu
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    await Menu.create({
      date: today,
      breakfast: {
        items: [
          { name: { en: 'Poha with Sev', hi: 'सेव के साथ पोहा', mr: 'शेव सह पोहे' }, isVegetarian: true },
          { name: { en: 'Idli Sambar', hi: 'इडली सांभर', mr: 'इडली सांभर' }, isVegetarian: true },
          { name: { en: 'Paratha with Curd', hi: 'दही के साथ पराठा', mr: 'दही सह पराठा' }, isVegetarian: true },
          { name: { en: 'Fresh Fruits', hi: 'ताजे फल', mr: 'ताजी फळे' }, isVegetarian: true },
          { name: { en: 'Tea/Coffee/Milk', hi: 'चाय/कॉफी/दूध', mr: 'चहा/कॉफी/दूध' }, isVegetarian: true }
        ],
        timing: { start: '07:00', end: '09:00' }
      },
      lunch: {
        items: [
          { name: { en: 'Dal Tadka', hi: 'दाल तड़का', mr: 'डाळ तडका' }, isVegetarian: true },
          { name: { en: 'Jeera Rice', hi: 'जीरा राइस', mr: 'जिरा भात' }, isVegetarian: true },
          { name: { en: 'Mixed Vegetable Curry', hi: 'मिक्स वेज करी', mr: 'मिक्स भाजी करी' }, isVegetarian: true },
          { name: { en: 'Roti/Chapati', hi: 'रोटी/चपाती', mr: 'पोळी/चपाती' }, isVegetarian: true },
          { name: { en: 'Raita', hi: 'रायता', mr: 'रायता' }, isVegetarian: true },
          { name: { en: 'Pickle & Papad', hi: 'अचार और पापड़', mr: 'लोणचे आणि पापड' }, isVegetarian: true }
        ],
        timing: { start: '12:30', end: '14:00' }
      },
      dinner: {
        items: [
          { name: { en: 'Paneer Butter Masala', hi: 'पनीर बटर मसाला', mr: 'पनीर बटर मसाला' }, isVegetarian: true },
          { name: { en: 'Dal Makhani', hi: 'दाल मखनी', mr: 'डाळ मखनी' }, isVegetarian: true },
          { name: { en: 'Butter Naan', hi: 'बटर नान', mr: 'बटर नान' }, isVegetarian: true },
          { name: { en: 'Veg Biryani', hi: 'वेज बिरयानी', mr: 'व्हेज बिर्याणी' }, isVegetarian: true },
          { name: { en: 'Gulab Jamun', hi: 'गुलाब जामुन', mr: 'गुलाब जामुन' }, isVegetarian: true }
        ],
        timing: { start: '19:30', end: '21:00' }
      },
      specialNote: { 
        en: 'Today\'s special: Authentic Maharashtrian Thali with Puran Poli available on request. Jain food available.',
        hi: 'आज का विशेष: अनुरोध पर पूरन पोली के साथ प्रामाणिक महाराष्ट्रीयन थाली उपलब्ध। जैन भोजन उपलब्ध।',
        mr: 'आजचे विशेष: विनंतीनुसार पुरणपोळीसह अस्सल महाराष्ट्रीयन थाळी उपलब्ध. जैन भोजन उपलब्ध.'
      },
      isActive: true,
      createdBy: admin._id
    });
    console.log('🍽️ Created today\'s menu');

    // Create Sample Poll
    await Poll.create({
      title: { en: 'Vote for Next Destination', hi: 'अगली मंजिल के लिए वोट करें', mr: 'पुढील गंतव्यासाठी मतदान करा' },
      question: { 
        en: 'Which destination would you like us to organize a tour to next?',
        hi: 'आप चाहते हैं कि हम अगली बार किस स्थान की यात्रा आयोजित करें?',
        mr: 'तुम्हाला पुढे कोणत्या ठिकाणाची यात्रा आयोजित करायची आहे?'
      },
      options: [
        { destination: { name: { en: 'Kedarnath Helicopter Yatra', hi: 'केदारनाथ हेलीकॉप्टर यात्रा', mr: 'केदारनाथ हेलिकॉप्टर यात्रा' } }, voteCount: 45 },
        { destination: { name: { en: 'Amarnath Cave Pilgrimage', hi: 'अमरनाथ गुफा तीर्थयात्रा', mr: 'अमरनाथ गुफा तीर्थयात्रा' } }, voteCount: 38 },
        { destination: { name: { en: 'Rameswaram Temple Tour', hi: 'रामेश्वरम मंदिर यात्रा', mr: 'रामेश्वरम मंदिर यात्रा' } }, voteCount: 52 },
        { destination: { name: { en: 'Konark Sun Temple & Puri Jagannath', hi: 'कोणार्क सूर्य मंदिर और पुरी जगन्नाथ', mr: 'कोणार्क सूर्य मंदिर आणि पुरी जगन्नाथ' } }, voteCount: 31 }
      ],
      totalVotes: 166,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: true,
      createdBy: admin._id
    });
    console.log('🗳️ Created sample poll');

    // Create Sample Galleries
    await Gallery.insertMany([
      {
        title: { en: 'Char Dham Yatra 2024', hi: 'चार धाम यात्रा 2024', mr: 'चार धाम यात्रा 2024' },
        description: { 
          en: 'Memorable moments from our spiritual Char Dham pilgrimage through the Himalayas',
          hi: 'हिमालय के माध्यम से हमारी आध्यात्मिक चार धाम तीर्थयात्रा के यादगार पल',
          mr: 'हिमालयातून आमच्या आध्यात्मिक चार धाम यात्रेचे स्मरणीय क्षण'
        },
        tourSlug: 'char-dham-yatra',
        coverImage: 'https://images.unsplash.com/photo-1593181520745-76e96c64a7ae?w=800',
        photos: [
          { url: 'https://images.unsplash.com/photo-1593181520745-76e96c64a7ae?w=800', caption: { en: 'Kedarnath Temple at Dawn' } },
          { url: 'https://images.unsplash.com/photo-1623850223173-f98bf93eb8cd?w=800', caption: { en: 'Badrinath Temple' } },
          { url: 'https://images.unsplash.com/photo-1591018653367-2bd7bc358c69?w=800', caption: { en: 'Ganga Aarti at Haridwar' } },
          { url: 'https://images.unsplash.com/photo-1606298855672-3efb63017be8?w=800', caption: { en: 'Mountain Views' } }
        ],
        totalPhotos: 4,
        isPublished: true,
        createdBy: admin._id
      },
      {
        title: { en: 'Golden Triangle Heritage Tour', hi: 'गोल्डन ट्राएंगल हेरिटेज टूर', mr: 'गोल्डन ट्रायंगल हेरिटेज टूर' },
        description: { 
          en: 'Exploring the magnificent monuments of Delhi, Agra, and Jaipur',
          hi: 'दिल्ली, आगरा और जयपुर के भव्य स्मारकों का अन्वेषण',
          mr: 'दिल्ली, आग्रा आणि जयपूरच्या भव्य स्मारकांचा शोध'
        },
        tourSlug: 'golden-triangle-tour',
        coverImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800',
        photos: [
          { url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800', caption: { en: 'Taj Mahal at Sunrise' } },
          { url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800', caption: { en: 'Amber Fort Jaipur' } },
          { url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', caption: { en: 'Red Fort Delhi' } },
          { url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800', caption: { en: 'Hawa Mahal' } }
        ],
        totalPhotos: 4,
        isPublished: true,
        createdBy: admin._id
      },
      {
        title: { en: 'Ayodhya Ram Mandir Inauguration Tour', hi: 'अयोध्या राम मंदिर उद्घाटन यात्रा', mr: 'अयोध्या राम मंदिर उद्घाटन यात्रा' },
        description: { 
          en: 'Historic moments from the Ram Mandir inauguration and divine darshan',
          hi: 'राम मंदिर उद्घाटन और दिव्य दर्शन के ऐतिहासिक क्षण',
          mr: 'राम मंदिर उद्घाटन आणि दिव्य दर्शनाचे ऐतिहासिक क्षण'
        },
        tourSlug: 'ayodhya-ram-mandir-yatra',
        coverImage: 'https://images.unsplash.com/photo-1705076795764-79a1394f5967?w=800',
        photos: [
          { url: 'https://images.unsplash.com/photo-1705076795764-79a1394f5967?w=800', caption: { en: 'Ram Mandir' } }
        ],
        totalPhotos: 1,
        isPublished: true,
        createdBy: admin._id
      }
    ]);
    console.log('📸 Created sample galleries');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('   Admin: admin@sacredjourneys.com / admin123');
    console.log('   User:  ramesh@example.com / user123');
    console.log('\n📊 Data Summary:');
    console.log(`   - ${pilgrimageTours.length} Pilgrimage Tours`);
    console.log(`   - ${historicTours.length} Historic Tours`);
    console.log(`   - ${mixedTours.length} Mixed Tours`);
    console.log('   - 1 Active Poll');
    console.log('   - Today\'s Menu');
    console.log('   - 3 Photo Galleries\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();
