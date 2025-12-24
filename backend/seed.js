/**
 * Database Seeder for Holy Travels
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

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/holy_travels';

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

    // Create Admin User (Owner)
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Nikita Ghatode',
      email: 'nikitaghatode7@gmail.com',
      password: adminPassword,
      phone: '7898360491',
      role: 'super_admin',
      address: {
        city: 'Nagpur',
        state: 'Maharashtra',
        country: 'India'
      },
      isVerified: true,
      phoneVerified: true
    });
    console.log('👤 Admin created: nikitaghatode7@gmail.com / admin123');

    // Create Sample User
    const userPassword = await bcrypt.hash('user123', 10);
    const user = await User.create({
      name: 'Demo User',
      email: 'demo@holytravels.com',
      password: userPassword,
      phone: '9999999999',
      role: 'user',
      isVerified: true
    });
    console.log('👤 Demo User created: demo@holytravels.com / user123');

    // ========================================
    // YOUR 5 SPECIFIC TOURS
    // ========================================
    const tours = [
      // TOUR 1: Mathura Vrindavan
      {
        title: { 
          en: 'Mathura Vrindavan Divine Yatra', 
          hi: 'मथुरा वृंदावन दिव्य यात्रा', 
          mr: 'मथुरा वृंदावन दिव्य यात्रा' 
        },
        slug: 'mathura-vrindavan-yatra',
        description: { 
          en: 'Explore the divine land of Lord Krishna - Mathura and Vrindavan. Visit the sacred Krishna Janmabhoomi, Banke Bihari Temple, Prem Mandir, ISKCON Temple, and experience the enchanting Yamuna Aarti. Walk through the ancient lanes where Lord Krishna spent his childhood.',
          hi: 'भगवान कृष्ण की दिव्य भूमि - मथुरा और वृंदावन का अन्वेषण करें। पवित्र कृष्ण जन्मभूमि, बांके बिहारी मंदिर, प्रेम मंदिर, इस्कॉन मंदिर के दर्शन करें।',
          mr: 'भगवान कृष्णाची दिव्य भूमी - मथुरा आणि वृंदावन एक्सप्लोर करा.'
        },
        shortDescription: {
          en: 'Sacred journey to Krishna\'s birthplace - Mathura & Vrindavan temples',
          hi: 'कृष्ण जन्मभूमि की पवित्र यात्रा - मथुरा और वृंदावन मंदिर',
          mr: 'कृष्ण जन्मभूमीची पवित्र यात्रा - मथुरा आणि वृंदावन मंदिरे'
        },
        category: 'pilgrimage',
        duration: { days: 3, nights: 2 },
        price: { amount: 6500, currency: 'INR', discountedAmount: 5500 },
        startDates: [
          { date: new Date('2025-01-15'), availableSeats: 40, totalSeats: 45, status: 'upcoming' },
          { date: new Date('2025-01-25'), availableSeats: 45, totalSeats: 45, status: 'upcoming' },
          { date: new Date('2025-02-05'), availableSeats: 45, totalSeats: 45, status: 'upcoming' },
          { date: new Date('2025-02-15'), availableSeats: 45, totalSeats: 45, status: 'upcoming' }
        ],
        maxGroupSize: 45,
        difficulty: 'easy',
        isActive: true,
        isFeatured: true,
        averageRating: 4.8,
        totalReviews: 245,
        images: [
          { url: 'https://images.pexels.com/photos/17376637/pexels-photo-17376637.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'Banke Bihari Temple Vrindavan', isMain: true },
          { url: 'https://images.pexels.com/photos/14660727/pexels-photo-14660727.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'Prem Mandir Vrindavan' },
          { url: 'https://images.pexels.com/photos/6064432/pexels-photo-6064432.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'Krishna Janmabhoomi Mathura' },
          { url: 'https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'ISKCON Temple Vrindavan' },
          { url: 'https://images.pexels.com/photos/5206646/pexels-photo-5206646.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'Yamuna Ghat' }
        ],
        departureLocation: { city: 'Nagpur', station: 'Nagpur Railway Station', address: 'Maharashtra' },
        itinerary: [
          { day: 1, title: 'Nagpur to Mathura', description: 'Departure from Nagpur by train/bus, reach Mathura by evening. Visit Krishna Janmabhoomi Temple, Dwarkadhish Temple, and evening Yamuna Aarti.' },
          { day: 2, title: 'Mathura & Vrindavan Darshan', description: 'Early morning visit to Banke Bihari Temple, Prem Mandir, ISKCON Temple, Radha Raman Temple, Govind Dev Temple. Evening Aarti at Banke Bihari.' },
          { day: 3, title: 'Gokul & Return', description: 'Visit Gokul - where Krishna grew up, Nand Gaon, Barsana (Radha\'s birthplace). Return journey to Nagpur.' }
        ],
        inclusions: ['AC Transport', 'Hotel Stay (2 nights)', 'Breakfast & Dinner', 'Temple Darshan Assistance', 'Experienced Guide', 'All Taxes'],
        exclusions: ['Lunch', 'Personal Expenses', 'Donation', 'Travel Insurance', 'Tips'],
        highlights: [
          { en: 'Banke Bihari Temple Darshan', hi: 'बांके बिहारी मंदिर दर्शन', mr: 'बांके बिहारी मंदिर दर्शन' },
          { en: 'Krishna Janmabhoomi Visit', hi: 'कृष्ण जन्मभूमि दर्शन', mr: 'कृष्ण जन्मभूमी भेट' },
          { en: 'Prem Mandir Light Show', hi: 'प्रेम मंदिर लाइट शो', mr: 'प्रेम मंदिर लाईट शो' }
        ],
        createdBy: admin._id
      },

      // TOUR 2: Dwarka Somnath
      {
        title: { 
          en: 'Dwarka Somnath Divine Darshan', 
          hi: 'द्वारका सोमनाथ दिव्य दर्शन', 
          mr: 'द्वारका सोमनाथ दिव्य दर्शन' 
        },
        slug: 'dwarka-somnath-darshan',
        description: { 
          en: 'Visit the legendary Dwarkadhish Temple - the ancient abode of Lord Krishna, and Somnath Temple - the first among 12 Jyotirlingas. Experience divine coastal pilgrimage along the Arabian Sea with stunning sunsets, Nageshwar Jyotirlinga, and Bet Dwarka Island.',
          hi: 'भगवान कृष्ण के प्राचीन निवास द्वारकाधीश मंदिर और 12 ज्योतिर्लिंगों में पहले सोमनाथ मंदिर के दर्शन करें।',
          mr: 'भगवान कृष्णाचे प्राचीन निवासस्थान द्वारकाधीश मंदिर आणि 12 ज्योतिर्लिंगांपैकी पहिले सोमनाथ मंदिर यांना भेट द्या.'
        },
        shortDescription: {
          en: 'Sacred pilgrimage to Lord Krishna\'s Dwarka and first Jyotirlinga Somnath',
          hi: 'भगवान कृष्ण की द्वारका और पहले ज्योतिर्लिंग सोमनाथ की पवित्र यात्रा',
          mr: 'भगवान कृष्णाची द्वारका आणि पहिले ज्योतिर्लिंग सोमनाथ यांची पवित्र यात्रा'
        },
        category: 'pilgrimage',
        duration: { days: 5, nights: 4 },
        price: { amount: 15000, currency: 'INR', discountedAmount: 13500 },
        startDates: [
          { date: new Date('2025-01-20'), availableSeats: 35, totalSeats: 40, status: 'upcoming' },
          { date: new Date('2025-02-10'), availableSeats: 40, totalSeats: 40, status: 'upcoming' },
          { date: new Date('2025-02-25'), availableSeats: 40, totalSeats: 40, status: 'upcoming' }
        ],
        maxGroupSize: 40,
        difficulty: 'easy',
        isActive: true,
        isFeatured: true,
        averageRating: 4.9,
        totalReviews: 189,
        images: [
          { url: 'https://images.pexels.com/photos/6064355/pexels-photo-6064355.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'Somnath Temple Gujarat', isMain: true },
          { url: 'https://images.pexels.com/photos/9749637/pexels-photo-9749637.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'Dwarkadhish Temple' },
          { url: 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'Nageshwar Jyotirlinga' },
          { url: 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'Bet Dwarka Island' },
          { url: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'Arabian Sea Sunset' }
        ],
        departureLocation: { city: 'Nagpur', station: 'Nagpur Railway Station', address: 'Maharashtra' },
        itinerary: [
          { day: 1, title: 'Nagpur to Ahmedabad', description: 'Departure from Nagpur, reach Ahmedabad. Visit Sabarmati Ashram and rest.' },
          { day: 2, title: 'Ahmedabad to Dwarka', description: 'Drive to Dwarka (450 km). Evening Aarti at Dwarkadhish Temple, witness the mesmerizing sunset.' },
          { day: 3, title: 'Dwarka Full Day', description: 'Visit Dwarkadhish Temple, Bet Dwarka by boat, Rukmini Temple, Nageshwar Jyotirlinga, Gopi Talav.' },
          { day: 4, title: 'Dwarka to Somnath', description: 'Drive to Somnath (230 km). Visit Bhalka Tirth enroute. Evening Sound & Light Show at Somnath Temple.' },
          { day: 5, title: 'Somnath & Return', description: 'Early morning Aarti at Somnath, visit Triveni Sangam. Return journey to Nagpur via Ahmedabad.' }
        ],
        inclusions: ['AC Volvo Bus', 'Hotel Stay (4 nights)', 'Breakfast & Dinner', 'Temple Darshan', 'Boat Ride to Bet Dwarka', 'Guide'],
        exclusions: ['Lunch', 'Flight Tickets', 'Personal Expenses', 'Camera Fees', 'Special Puja'],
        highlights: [
          { en: 'Dwarkadhish Temple Darshan', hi: 'द्वारकाधीश मंदिर दर्शन', mr: 'द्वारकाधीश मंदिर दर्शन' },
          { en: 'Somnath Jyotirlinga', hi: 'सोमनाथ ज्योतिर्लिंग', mr: 'सोमनाथ ज्योतिर्लिंग' },
          { en: 'Bet Dwarka Boat Ride', hi: 'बेट द्वारका नाव यात्रा', mr: 'बेट द्वारका बोट राइड' }
        ],
        createdBy: admin._id
      },

      // TOUR 3: Jaipur Khatu Shyam
      {
        title: { 
          en: 'Jaipur & Khatu Shyam Ji Darshan', 
          hi: 'जयपुर और खाटू श्याम जी दर्शन', 
          mr: 'जयपूर आणि खाटू श्याम जी दर्शन' 
        },
        slug: 'jaipur-khatu-shyam-darshan',
        description: { 
          en: 'Experience the Pink City Jaipur with its magnificent forts and palaces, combined with divine darshan at Khatu Shyam Ji Temple - one of the most revered temples dedicated to Barbarik (grandson of Bheem). Visit Amber Fort, Hawa Mahal, City Palace, and the miraculous Khatu Shyam Temple.',
          hi: 'गुलाबी शहर जयपुर के भव्य किलों और महलों का अनुभव करें, साथ में खाटू श्याम जी मंदिर में दिव्य दर्शन - बर्बरीक (भीम के पोते) को समर्पित सबसे पूजनीय मंदिरों में से एक।',
          mr: 'गुलाबी शहर जयपूरचे भव्य किल्ले आणि राजवाडे आणि खाटू श्याम जी मंदिरातील दिव्य दर्शन अनुभवा.'
        },
        shortDescription: {
          en: 'Pink City Jaipur heritage tour with Khatu Shyam Ji Temple darshan',
          hi: 'गुलाबी शहर जयपुर विरासत यात्रा और खाटू श्याम जी मंदिर दर्शन',
          mr: 'गुलाबी शहर जयपूर वारसा दौरा आणि खाटू श्याम जी मंदिर दर्शन'
        },
        category: 'mixed',
        duration: { days: 4, nights: 3 },
        price: { amount: 9500, currency: 'INR', discountedAmount: 8500 },
        startDates: [
          { date: new Date('2025-01-18'), availableSeats: 38, totalSeats: 40, status: 'upcoming' },
          { date: new Date('2025-02-01'), availableSeats: 40, totalSeats: 40, status: 'upcoming' },
          { date: new Date('2025-02-15'), availableSeats: 40, totalSeats: 40, status: 'upcoming' },
          { date: new Date('2025-03-01'), availableSeats: 40, totalSeats: 40, status: 'upcoming' }
        ],
        maxGroupSize: 40,
        difficulty: 'easy',
        isActive: true,
        isFeatured: true,
        averageRating: 4.7,
        totalReviews: 156,
        images: [
          { url: 'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'Amber Fort Jaipur', isMain: true },
          { url: 'https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'Hawa Mahal Pink City' },
          { url: 'https://images.pexels.com/photos/7084186/pexels-photo-7084186.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'Khatu Shyam Temple' },
          { url: 'https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'City Palace Jaipur' },
          { url: 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'Jal Mahal' }
        ],
        departureLocation: { city: 'Nagpur', station: 'Nagpur Railway Station', address: 'Maharashtra' },
        itinerary: [
          { day: 1, title: 'Nagpur to Jaipur', description: 'Departure from Nagpur by train/bus. Reach Jaipur by evening, check-in and rest.' },
          { day: 2, title: 'Jaipur Sightseeing', description: 'Full day Jaipur tour - Amber Fort (elephant ride optional), Jal Mahal, Hawa Mahal, City Palace, Jantar Mantar, local bazaar shopping.' },
          { day: 3, title: 'Khatu Shyam Ji', description: 'Early morning drive to Khatu Shyam Ji Temple (80 km). Attend morning Aarti, darshan, and rituals. Visit Salasar Balaji Temple nearby. Return to Jaipur.' },
          { day: 4, title: 'Return Journey', description: 'Morning leisure time for shopping. Departure for Nagpur with divine memories.' }
        ],
        inclusions: ['AC Transport', 'Hotel Stay (3 nights)', 'Breakfast & Dinner', 'Sightseeing as per itinerary', 'Guide Services', 'Monument Entry Fees'],
        exclusions: ['Lunch', 'Elephant Ride', 'Personal Shopping', 'Travel Insurance', 'Tips'],
        highlights: [
          { en: 'Khatu Shyam Ji Darshan', hi: 'खाटू श्याम जी दर्शन', mr: 'खाटू श्याम जी दर्शन' },
          { en: 'Amber Fort Visit', hi: 'आमेर किला भ्रमण', mr: 'आमेर किल्ला भेट' },
          { en: 'Hawa Mahal & City Palace', hi: 'हवा महल और सिटी पैलेस', mr: 'हवा महाल आणि सिटी पॅलेस' }
        ],
        createdBy: admin._id
      },

      // TOUR 4: Nashik Shirdi Shani Shingnapur
      {
        title: { 
          en: 'Nashik Shirdi Shani Shingnapur Yatra', 
          hi: 'नासिक शिर्डी शनि शिंगणापुर यात्रा', 
          mr: 'नाशिक शिर्डी शनी शिंगणापूर यात्रा' 
        },
        slug: 'nashik-shirdi-shani-shingnapur',
        description: { 
          en: 'Complete Maharashtra pilgrimage covering Trimbakeshwar Jyotirlinga in Nashik, Sai Baba Temple in Shirdi, and the miraculous Shani Shingnapur Temple. Experience the sacred Godavari Ghat, Panchvati, and immerse in divine blessings of Sai Baba.',
          hi: 'नासिक में त्र्यंबकेश्वर ज्योतिर्लिंग, शिर्डी में साईं बाबा मंदिर और चमत्कारी शनि शिंगणापुर मंदिर को कवर करने वाली संपूर्ण महाराष्ट्र तीर्थयात्रा।',
          mr: 'नाशिक मधील त्र्यंबकेश्वर ज्योतिर्लिंग, शिर्डीतील साईबाबा मंदिर आणि चमत्कारिक शनी शिंगणापूर मंदिर यांचा समावेश असलेली संपूर्ण महाराष्ट्र तीर्थयात्रा.'
        },
        shortDescription: {
          en: 'Divine Maharashtra tour - Trimbakeshwar, Shirdi Sai Baba & Shani Shingnapur',
          hi: 'दिव्य महाराष्ट्र यात्रा - त्र्यंबकेश्वर, शिर्डी साईं बाबा और शनि शिंगणापुर',
          mr: 'दिव्य महाराष्ट्र यात्रा - त्र्यंबकेश्वर, शिर्डी साईबाबा आणि शनी शिंगणापूर'
        },
        category: 'pilgrimage',
        duration: { days: 4, nights: 3 },
        price: { amount: 7500, currency: 'INR', discountedAmount: 6500 },
        startDates: [
          { date: new Date('2025-01-10'), availableSeats: 42, totalSeats: 45, status: 'upcoming' },
          { date: new Date('2025-01-24'), availableSeats: 45, totalSeats: 45, status: 'upcoming' },
          { date: new Date('2025-02-07'), availableSeats: 45, totalSeats: 45, status: 'upcoming' },
          { date: new Date('2025-02-21'), availableSeats: 45, totalSeats: 45, status: 'upcoming' }
        ],
        maxGroupSize: 45,
        difficulty: 'easy',
        isActive: true,
        isFeatured: true,
        averageRating: 4.9,
        totalReviews: 312,
        images: [
          { url: 'https://images.pexels.com/photos/5206729/pexels-photo-5206729.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'Shirdi Sai Baba Temple', isMain: true },
          { url: 'https://images.pexels.com/photos/6064430/pexels-photo-6064430.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'Trimbakeshwar Temple Nashik' },
          { url: 'https://images.pexels.com/photos/2387418/pexels-photo-2387418.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'Shani Shingnapur' },
          { url: 'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'Godavari Ghat Nashik' },
          { url: 'https://images.pexels.com/photos/3290076/pexels-photo-3290076.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'Panchvati Nashik' }
        ],
        departureLocation: { city: 'Nagpur', station: 'Nagpur Railway Station', address: 'Maharashtra' },
        itinerary: [
          { day: 1, title: 'Nagpur to Shirdi', description: 'Departure from Nagpur early morning. Reach Shirdi by afternoon. Evening Aarti at Sai Baba Samadhi Mandir. Visit Dwarkamai, Chavadi, Sai Museum.' },
          { day: 2, title: 'Shirdi & Shani Shingnapur', description: 'Morning Kakad Aarti at Shirdi (4:30 AM). After breakfast, drive to Shani Shingnapur (65 km). Darshan at Shani Temple. Return to Shirdi.' },
          { day: 3, title: 'Shirdi to Nashik', description: 'Drive to Nashik (90 km). Visit Trimbakeshwar Jyotirlinga, Panchvati, Kalaram Temple, Godavari Ghat. Evening Aarti at Ramkund.' },
          { day: 4, title: 'Nashik & Return', description: 'Morning Abhishek at Trimbakeshwar (optional). Visit Sula Vineyards (optional). Return journey to Nagpur.' }
        ],
        inclusions: ['AC Bus Transport', 'Hotel Stay (3 nights)', 'Breakfast & Dinner', 'Darshan Assistance', 'Guide Services', 'All Taxes'],
        exclusions: ['Lunch', 'VIP Darshan Tickets', 'Personal Expenses', 'Special Puja', 'Travel Insurance'],
        highlights: [
          { en: 'Sai Baba Samadhi Darshan', hi: 'साईं बाबा समाधि दर्शन', mr: 'साईबाबा समाधी दर्शन' },
          { en: 'Trimbakeshwar Jyotirlinga', hi: 'त्र्यंबकेश्वर ज्योतिर्लिंग', mr: 'त्र्यंबकेश्वर ज्योतिर्लिंग' },
          { en: 'Shani Shingnapur Temple', hi: 'शनि शिंगणापुर मंदिर', mr: 'शनी शिंगणापूर मंदिर' }
        ],
        createdBy: admin._id
      },

      // TOUR 5: Rameshwaram Balaji Puram (Tirupati)
      {
        title: { 
          en: 'Rameshwaram & Balaji Puram (Tirupati) Yatra', 
          hi: 'रामेश्वरम और बालाजी पुरम (तिरुपति) यात्रा', 
          mr: 'रामेश्वरम आणि बालाजी पुरम (तिरुपती) यात्रा' 
        },
        slug: 'rameshwaram-balaji-puram-tirupati',
        description: { 
          en: 'Divine South India pilgrimage covering Rameshwaram - one of the Char Dhams and Tirupati Balaji - the world\'s richest temple. Experience the sacred Ramanathaswamy Temple with its magnificent corridors, Agni Theertham, and VIP darshan at Tirumala Venkateswara Temple. Cross the Pamban Bridge and witness the confluence of Bay of Bengal and Indian Ocean.',
          hi: 'दक्षिण भारत की दिव्य तीर्थयात्रा जिसमें रामेश्वरम - चार धामों में से एक और तिरुपति बालाजी - दुनिया का सबसे अमीर मंदिर शामिल है।',
          mr: 'दक्षिण भारतातील दिव्य तीर्थयात्रा - रामेश्वरम (चार धामांपैकी एक) आणि तिरुपती बालाजी (जगातील सर्वात श्रीमंत मंदिर).'
        },
        shortDescription: {
          en: 'Complete South India pilgrimage - Rameshwaram Char Dham & Tirupati Balaji',
          hi: 'संपूर्ण दक्षिण भारत तीर्थयात्रा - रामेश्वरम चार धाम और तिरुपति बालाजी',
          mr: 'संपूर्ण दक्षिण भारत तीर्थयात्रा - रामेश्वरम चार धाम आणि तिरुपती बालाजी'
        },
        category: 'pilgrimage',
        duration: { days: 7, nights: 6 },
        price: { amount: 22000, currency: 'INR', discountedAmount: 19500 },
        startDates: [
          { date: new Date('2025-01-12'), availableSeats: 35, totalSeats: 40, status: 'upcoming' },
          { date: new Date('2025-02-02'), availableSeats: 40, totalSeats: 40, status: 'upcoming' },
          { date: new Date('2025-02-16'), availableSeats: 40, totalSeats: 40, status: 'upcoming' },
          { date: new Date('2025-03-01'), availableSeats: 40, totalSeats: 40, status: 'upcoming' }
        ],
        maxGroupSize: 40,
        difficulty: 'easy',
        isActive: true,
        isFeatured: true,
        averageRating: 4.9,
        totalReviews: 278,
        images: [
          { url: 'https://images.pexels.com/photos/17376541/pexels-photo-17376541.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'Ramanathaswamy Temple Rameshwaram', isMain: true },
          { url: 'https://images.pexels.com/photos/14661007/pexels-photo-14661007.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'Tirumala Balaji Temple' },
          { url: 'https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'Temple Gopuram' },
          { url: 'https://images.pexels.com/photos/3225528/pexels-photo-3225528.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'Pamban Bridge' },
          { url: 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'Agni Theertham Beach' }
        ],
        departureLocation: { city: 'Nagpur', station: 'Nagpur Railway Station', address: 'Maharashtra' },
        itinerary: [
          { day: 1, title: 'Nagpur to Chennai', description: 'Departure from Nagpur by train. Overnight journey to Chennai.' },
          { day: 2, title: 'Chennai to Rameshwaram', description: 'Arrive Chennai, drive to Rameshwaram (560 km). Cross the iconic Pamban Bridge. Evening check-in.' },
          { day: 3, title: 'Rameshwaram Darshan', description: 'Early morning bath at Agni Theertham (22 sacred wells). Darshan at Ramanathaswamy Temple. Visit Gandhamadhana Parvatham, Dhanushkodi, Five-faced Hanuman Temple.' },
          { day: 4, title: 'Rameshwaram to Madurai', description: 'Visit remaining temples. Drive to Madurai (170 km). Evening visit to Meenakshi Temple.' },
          { day: 5, title: 'Madurai to Tirupati', description: 'Drive to Tirupati (450 km). Evening darshan at Padmavathi Temple.' },
          { day: 6, title: 'Tirumala Balaji Darshan', description: 'Early morning VIP darshan at Tirumala Venkateswara Temple. Tonsure (optional), Laddu Prasadam. Visit temple museum.' },
          { day: 7, title: 'Tirupati to Chennai & Return', description: 'Visit Srikalahasti Temple (optional). Drive to Chennai (140 km). Board train to Nagpur.' }
        ],
        inclusions: ['Train Tickets (Sleeper)', 'AC Transport', 'Hotel Stay (5 nights)', 'Breakfast & Dinner', 'VIP Darshan Tirupati', 'Guide Services', 'All Permits'],
        exclusions: ['Lunch', 'Special Puja/Abhishek', 'Tonsure Charges', 'Personal Expenses', 'Travel Insurance'],
        highlights: [
          { en: 'Ramanathaswamy Temple Darshan', hi: 'रामनाथस्वामी मंदिर दर्शन', mr: 'रामनाथस्वामी मंदिर दर्शन' },
          { en: 'Tirupati Balaji VIP Darshan', hi: 'तिरुपति बालाजी वीआईपी दर्शन', mr: 'तिरुपती बालाजी व्हीआयपी दर्शन' },
          { en: 'Pamban Bridge Crossing', hi: 'पंबन ब्रिज क्रॉसिंग', mr: 'पंबन ब्रिज क्रॉसिंग' },
          { en: 'Agni Theertham Holy Bath', hi: 'अग्नि तीर्थम पवित्र स्नान', mr: 'अग्नी तीर्थम पवित्र स्नान' }
        ],
        createdBy: admin._id
      }
    ];

    // Insert all tours
    await Tour.insertMany(tours);
    console.log(`🏛️ Created ${tours.length} tours`);

    // Create Gallery Albums
    const galleryAlbums = [
      { 
        title: { en: 'Mathura Vrindavan Tour', hi: 'मथुरा वृंदावन यात्रा', mr: 'मथुरा वृंदावन यात्रा' },
        description: { en: 'Sacred journey to Krishna\'s birthplace' },
        category: 'pilgrimage',
        coverImage: 'https://images.pexels.com/photos/17376637/pexels-photo-17376637.jpeg?auto=compress&cs=tinysrgb&w=600',
        photos: [
          { url: 'https://images.pexels.com/photos/17376637/pexels-photo-17376637.jpeg?auto=compress&cs=tinysrgb&w=600', location: 'Mathura' }
        ],
        isPublic: true, isFeatured: true, createdBy: admin._id
      },
      { 
        title: { en: 'Dwarka Somnath Pilgrimage', hi: 'द्वारका सोमनाथ तीर्थयात्रा', mr: 'द्वारका सोमनाथ तीर्थयात्रा' },
        description: { en: 'Divine Gujarat coastal pilgrimage' },
        category: 'pilgrimage',
        coverImage: 'https://images.pexels.com/photos/6064355/pexels-photo-6064355.jpeg?auto=compress&cs=tinysrgb&w=600',
        photos: [
          { url: 'https://images.pexels.com/photos/6064355/pexels-photo-6064355.jpeg?auto=compress&cs=tinysrgb&w=600', location: 'Gujarat' }
        ],
        isPublic: true, isFeatured: true, createdBy: admin._id
      },
      { 
        title: { en: 'Jaipur Heritage Tour', hi: 'जयपुर विरासत यात्रा', mr: 'जयपूर वारसा यात्रा' },
        description: { en: 'Pink City forts and palaces' },
        category: 'historic',
        coverImage: 'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=600',
        photos: [
          { url: 'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=600', location: 'Jaipur' }
        ],
        isPublic: true, isFeatured: true, createdBy: admin._id
      },
      { 
        title: { en: 'Shirdi Sai Baba Darshan', hi: 'शिर्डी साईं बाबा दर्शन', mr: 'शिर्डी साईबाबा दर्शन' },
        description: { en: 'Divine darshan at Sai Baba Temple' },
        category: 'pilgrimage',
        coverImage: 'https://images.pexels.com/photos/5206729/pexels-photo-5206729.jpeg?auto=compress&cs=tinysrgb&w=600',
        photos: [
          { url: 'https://images.pexels.com/photos/5206729/pexels-photo-5206729.jpeg?auto=compress&cs=tinysrgb&w=600', location: 'Shirdi' }
        ],
        isPublic: true, isFeatured: true, createdBy: admin._id
      },
      { 
        title: { en: 'Rameshwaram Temple Visit', hi: 'रामेश्वरम मंदिर दर्शन', mr: 'रामेश्वरम मंदिर भेट' },
        description: { en: 'One of the Char Dhams in South India' },
        category: 'pilgrimage',
        coverImage: 'https://images.pexels.com/photos/17376541/pexels-photo-17376541.jpeg?auto=compress&cs=tinysrgb&w=600',
        photos: [
          { url: 'https://images.pexels.com/photos/17376541/pexels-photo-17376541.jpeg?auto=compress&cs=tinysrgb&w=600', location: 'Rameshwaram' }
        ],
        isPublic: true, isFeatured: true, createdBy: admin._id
      },
      { 
        title: { en: 'Tirupati Balaji Darshan', hi: 'तिरुपति बालाजी दर्शन', mr: 'तिरुपती बालाजी दर्शन' },
        description: { en: 'World\'s richest temple' },
        category: 'pilgrimage',
        coverImage: 'https://images.pexels.com/photos/14661007/pexels-photo-14661007.jpeg?auto=compress&cs=tinysrgb&w=600',
        photos: [
          { url: 'https://images.pexels.com/photos/14661007/pexels-photo-14661007.jpeg?auto=compress&cs=tinysrgb&w=600', location: 'Tirupati' }
        ],
        isPublic: true, isFeatured: true, createdBy: admin._id
      }
    ];

    await Gallery.insertMany(galleryAlbums);
    console.log('📸 Created gallery albums');

    console.log('\n✅ ====================================');
    console.log('   DATABASE SEEDED SUCCESSFULLY!');
    console.log('====================================\n');
    console.log('📊 Summary:');
    console.log(`   - Admin: nikitaghatode7@gmail.com / admin123`);
    console.log(`   - Demo User: demo@holytravels.com / user123`);
    console.log(`   - Tours: ${tours.length}`);
    console.log(`   - Gallery Albums: ${galleryAlbums.length}`);
    console.log('\n🌐 Tours Added:');
    tours.forEach((t, i) => console.log(`   ${i+1}. ${t.title.en}`));
    console.log('\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
