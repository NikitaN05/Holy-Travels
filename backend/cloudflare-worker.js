/**
 * Holy Travels API - Cloudflare Worker
 * Deploy this to your Cloudflare Worker
 */

const tours = [
  {
    _id: "1",
    title: { en: "Mathura Vrindavan Divine Yatra", hi: "मथुरा वृंदावन दिव्य यात्रा" },
    slug: "mathura-vrindavan-yatra",
    description: { en: "Explore the divine land of Lord Krishna - Mathura and Vrindavan. Visit the sacred Krishna Janmabhoomi, Banke Bihari Temple, Prem Mandir, ISKCON Temple." },
    shortDescription: { en: "Sacred journey to Krishna's birthplace - Mathura & Vrindavan temples" },
    category: "pilgrimage",
    duration: { days: 3, nights: 2 },
    price: { amount: 6500, currency: "INR", discountedAmount: 5500 },
    maxGroupSize: 45,
    difficulty: "easy",
    isActive: true,
    isFeatured: true,
    averageRating: 4.8,
    totalReviews: 245,
    images: [
      { url: "https://images.pexels.com/photos/17376637/pexels-photo-17376637.jpeg?auto=compress&cs=tinysrgb&w=800", caption: "Banke Bihari Temple", isMain: true },
      { url: "https://images.pexels.com/photos/14660727/pexels-photo-14660727.jpeg?auto=compress&cs=tinysrgb&w=800", caption: "Prem Mandir" }
    ],
    departureLocation: { city: "Nagpur", state: "Maharashtra" },
    highlights: [
      { en: "Banke Bihari Temple Darshan" },
      { en: "Krishna Janmabhoomi Visit" },
      { en: "Prem Mandir Light Show" }
    ]
  },
  {
    _id: "2",
    title: { en: "Dwarka Somnath Divine Darshan", hi: "द्वारका सोमनाथ दिव्य दर्शन" },
    slug: "dwarka-somnath-darshan",
    description: { en: "Visit the legendary Dwarkadhish Temple - the ancient abode of Lord Krishna, and Somnath Temple - the first among 12 Jyotirlingas." },
    shortDescription: { en: "Sacred pilgrimage to Lord Krishna's Dwarka and first Jyotirlinga Somnath" },
    category: "pilgrimage",
    duration: { days: 5, nights: 4 },
    price: { amount: 15000, currency: "INR", discountedAmount: 13500 },
    maxGroupSize: 40,
    difficulty: "easy",
    isActive: true,
    isFeatured: true,
    averageRating: 4.9,
    totalReviews: 189,
    images: [
      { url: "https://images.pexels.com/photos/6064355/pexels-photo-6064355.jpeg?auto=compress&cs=tinysrgb&w=800", caption: "Somnath Temple", isMain: true },
      { url: "https://images.pexels.com/photos/9749637/pexels-photo-9749637.jpeg?auto=compress&cs=tinysrgb&w=800", caption: "Dwarkadhish Temple" }
    ],
    departureLocation: { city: "Nagpur", state: "Maharashtra" },
    highlights: [
      { en: "Dwarkadhish Temple Darshan" },
      { en: "Somnath Jyotirlinga" },
      { en: "Bet Dwarka Boat Ride" }
    ]
  },
  {
    _id: "3",
    title: { en: "Jaipur & Khatu Shyam Ji Darshan", hi: "जयपुर और खाटू श्याम जी दर्शन" },
    slug: "jaipur-khatu-shyam-darshan",
    description: { en: "Experience the Pink City Jaipur with magnificent forts and palaces, combined with divine darshan at Khatu Shyam Ji Temple." },
    shortDescription: { en: "Pink City Jaipur heritage tour with Khatu Shyam Ji Temple darshan" },
    category: "mixed",
    duration: { days: 4, nights: 3 },
    price: { amount: 9500, currency: "INR", discountedAmount: 8500 },
    maxGroupSize: 40,
    difficulty: "easy",
    isActive: true,
    isFeatured: true,
    averageRating: 4.7,
    totalReviews: 156,
    images: [
      { url: "https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=800", caption: "Amber Fort Jaipur", isMain: true },
      { url: "https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg?auto=compress&cs=tinysrgb&w=800", caption: "Hawa Mahal" }
    ],
    departureLocation: { city: "Nagpur", state: "Maharashtra" },
    highlights: [
      { en: "Khatu Shyam Ji Darshan" },
      { en: "Amber Fort Visit" },
      { en: "Hawa Mahal & City Palace" }
    ]
  },
  {
    _id: "4",
    title: { en: "Nashik Shirdi Shani Shingnapur Yatra", hi: "नासिक शिर्डी शनि शिंगणापुर यात्रा" },
    slug: "nashik-shirdi-shani-shingnapur",
    description: { en: "Complete Maharashtra pilgrimage covering Trimbakeshwar Jyotirlinga, Sai Baba Temple in Shirdi, and Shani Shingnapur Temple." },
    shortDescription: { en: "Divine Maharashtra tour - Trimbakeshwar, Shirdi Sai Baba & Shani Shingnapur" },
    category: "pilgrimage",
    duration: { days: 4, nights: 3 },
    price: { amount: 7500, currency: "INR", discountedAmount: 6500 },
    maxGroupSize: 45,
    difficulty: "easy",
    isActive: true,
    isFeatured: true,
    averageRating: 4.9,
    totalReviews: 312,
    images: [
      { url: "https://images.pexels.com/photos/5206729/pexels-photo-5206729.jpeg?auto=compress&cs=tinysrgb&w=800", caption: "Shirdi Sai Baba Temple", isMain: true },
      { url: "https://images.pexels.com/photos/6064430/pexels-photo-6064430.jpeg?auto=compress&cs=tinysrgb&w=800", caption: "Trimbakeshwar Temple" }
    ],
    departureLocation: { city: "Nagpur", state: "Maharashtra" },
    highlights: [
      { en: "Sai Baba Samadhi Darshan" },
      { en: "Trimbakeshwar Jyotirlinga" },
      { en: "Shani Shingnapur Temple" }
    ]
  },
  {
    _id: "5",
    title: { en: "Rameshwaram & Balaji Puram (Tirupati) Yatra", hi: "रामेश्वरम और बालाजी पुरम यात्रा" },
    slug: "rameshwaram-balaji-puram-tirupati",
    description: { en: "Divine South India pilgrimage covering Rameshwaram - one of the Char Dhams and Tirupati Balaji - the world's richest temple." },
    shortDescription: { en: "Complete South India pilgrimage - Rameshwaram Char Dham & Tirupati Balaji" },
    category: "pilgrimage",
    duration: { days: 7, nights: 6 },
    price: { amount: 22000, currency: "INR", discountedAmount: 19500 },
    maxGroupSize: 40,
    difficulty: "easy",
    isActive: true,
    isFeatured: true,
    averageRating: 4.9,
    totalReviews: 278,
    images: [
      { url: "https://images.pexels.com/photos/17376541/pexels-photo-17376541.jpeg?auto=compress&cs=tinysrgb&w=800", caption: "Ramanathaswamy Temple", isMain: true },
      { url: "https://images.pexels.com/photos/14661007/pexels-photo-14661007.jpeg?auto=compress&cs=tinysrgb&w=800", caption: "Tirumala Balaji Temple" }
    ],
    departureLocation: { city: "Nagpur", state: "Maharashtra" },
    highlights: [
      { en: "Ramanathaswamy Temple Darshan" },
      { en: "Tirupati Balaji VIP Darshan" },
      { en: "Pamban Bridge Crossing" }
    ]
  }
];

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json"
};

// Handle requests
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // API Routes
    if (path === "/" || path === "/api" || path === "/api/health") {
      return new Response(JSON.stringify({
        status: "ok",
        message: "Holy Travels API is running on Cloudflare Workers 🚀",
        timestamp: new Date().toISOString(),
        database: "connected",
        version: "1.0.0"
      }), { headers: corsHeaders });
    }

    // Get all tours
    if (path === "/api/tours" || path === "/tours") {
      const category = url.searchParams.get("category");
      const featured = url.searchParams.get("featured");
      
      let filteredTours = tours;
      
      if (category && category !== "all") {
        filteredTours = filteredTours.filter(t => t.category === category);
      }
      
      if (featured === "true") {
        filteredTours = filteredTours.filter(t => t.isFeatured);
      }

      return new Response(JSON.stringify({
        success: true,
        count: filteredTours.length,
        data: filteredTours
      }), { headers: corsHeaders });
    }

    // Featured tours (MUST come before slug route)
    if (path === "/api/tours/featured" || path === "/tours/featured") {
      const featuredTours = tours.filter(t => t.isFeatured).slice(0, 6);
      return new Response(JSON.stringify({
        success: true,
        count: featuredTours.length,
        data: featuredTours
      }), { headers: corsHeaders });
    }

    // Tour categories (MUST come before slug route)
    if (path === "/api/tours/categories" || path === "/tours/categories") {
      return new Response(JSON.stringify({
        success: true,
        data: [
          { _id: "pilgrimage", name: "Pilgrimage Tours", count: 4 },
          { _id: "mixed", name: "Mixed Tours", count: 1 },
          { _id: "historic", name: "Historic Tours", count: 0 },
          { _id: "cultural", name: "Cultural Tours", count: 0 }
        ]
      }), { headers: corsHeaders });
    }

    // Upcoming tours (MUST come before slug route)
    if (path === "/api/tours/upcoming" || path === "/tours/upcoming") {
      return new Response(JSON.stringify({
        success: true,
        data: tours.slice(0, 3)
      }), { headers: corsHeaders });
    }

    // Get single tour by slug (MUST come LAST)
    if (path.startsWith("/api/tours/") || path.startsWith("/tours/")) {
      const slug = path.split("/").pop();
      const tour = tours.find(t => t.slug === slug || t._id === slug);
      
      if (tour) {
        return new Response(JSON.stringify({
          success: true,
          data: tour
        }), { headers: corsHeaders });
      }
      
      return new Response(JSON.stringify({
        success: false,
        message: "Tour not found"
      }), { status: 404, headers: corsHeaders });
    }

    // Auth endpoints (mock)
    if (path === "/api/auth/login" || path === "/auth/login") {
      if (request.method === "POST") {
        return new Response(JSON.stringify({
          success: true,
          message: "Login successful",
          token: "demo-token-12345",
          user: {
            _id: "admin1",
            name: "Nikita Ghatode",
            email: "nikitaghatode7@gmail.com",
            role: "admin",
            phone: "7898360491"
          }
        }), { headers: corsHeaders });
      }
    }

    // Contact endpoint
    if (path === "/api/contact" || path === "/contact") {
      if (request.method === "POST") {
        return new Response(JSON.stringify({
          success: true,
          message: "Message received! We will contact you soon."
        }), { headers: corsHeaders });
      }
    }

    // Newsletter endpoint
    if (path === "/api/newsletter" || path === "/newsletter") {
      if (request.method === "POST") {
        return new Response(JSON.stringify({
          success: true,
          message: "Subscribed successfully!"
        }), { headers: corsHeaders });
      }
    }

    // Bookings endpoint (mock)
    if (path === "/api/bookings" || path === "/bookings") {
      if (request.method === "POST") {
        return new Response(JSON.stringify({
          success: true,
          message: "Booking created successfully!",
          bookingId: "BK" + Date.now()
        }), { headers: corsHeaders });
      }
      return new Response(JSON.stringify({
        success: true,
        data: []
      }), { headers: corsHeaders });
    }

    // 404 for other routes
    return new Response(JSON.stringify({
      success: false,
      message: "Route not found",
      availableRoutes: ["/api/tours", "/api/tours/:slug", "/api/health", "/api/auth/login", "/api/contact"]
    }), { status: 404, headers: corsHeaders });
  }
};

