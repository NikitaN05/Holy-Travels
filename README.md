# 🕉️ Sacred Journeys - Holy Pilgrimage & Cultural Tours

A comprehensive Tours & Travel management system for holy pilgrimage, historic, and cultural tours. Built with modern technologies featuring a web application, mobile app, and backend API.

![Sacred Journeys](https://via.placeholder.com/1200x400/ff7f11/ffffff?text=Sacred+Journeys+-+Holy+Pilgrimage+Tours)

## 🌟 Features

### For Travellers
- **Complete Trip Management** - View itineraries, ticket details, hotel info, platform numbers
- **Emergency Alert System** - One-tap SOS with loud siren and instant admin notification
- **Multi-language Support** - Hindi, English, and Marathi
- **Daily Food Menu** - Breakfast, lunch, dinner with timings and notifications
- **Photo Gallery** - Browse past tour photos organized by albums
- **Destination Polls** - Vote for upcoming tour destinations
- **Travel History** - Track all past tours and earn loyalty points

### For Admins
- **Dashboard Analytics** - Real-time insights on bookings, travellers, revenue
- **Tour Management** - Create, edit, delete tours with rich itineraries
- **Traveller Management** - View customer details and travel history
- **Notification System** - Send push notifications to all or specific users
- **Menu Management** - Update daily food menus
- **Gallery Management** - Upload and organize tour photos
- **Poll System** - Create destination polls and view results
- **Emergency Monitoring** - Real-time emergency alert tracking

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Web Frontend** | React 18, TailwindCSS, Zustand, React Router |
| **Mobile App** | React Native (Expo), React Navigation |
| **Backend API** | Node.js, Express.js, MongoDB, Socket.IO |
| **Authentication** | JWT, bcryptjs |
| **Internationalization** | i18next |
| **File Upload** | Multer |
| **Hosting** | Netlify (Web), Render (Backend) |

## 📁 Project Structure

```
tours-and-travel/
├── backend/                 # Node.js Express API
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── middleware/         # Auth & upload middleware
│   ├── uploads/            # Uploaded files
│   └── server.js           # Entry point
├── web/                    # React Web Application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── pages/admin/    # Admin dashboard pages
│   │   ├── services/       # API services
│   │   ├── store/          # Zustand state management
│   │   └── i18n/           # Translations
│   └── public/
└── mobile/                 # React Native Expo App
    ├── src/
    │   ├── screens/        # App screens
    │   ├── navigation/     # Navigation setup
    │   ├── services/       # API services
    │   ├── store/          # Zustand state management
    │   └── i18n/           # Translations
    └── app.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.x
- npm or yarn
- MongoDB (local or Atlas)
- Expo CLI (for mobile app)

### 1. Clone the Repository
```bash
git clone https://github.com/NikitaN05/sacred-journeys.git
cd sacred-journeys
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create environment file
cp env.example.txt .env
# Edit .env with your MongoDB URI and JWT secret

npm start
# Server runs on http://localhost:5000
```

### 3. Web Frontend Setup
```bash
cd web
npm install
npm run dev
# App runs on http://localhost:5173
```

### 4. Mobile App Setup
```bash
cd mobile
npm install
npx expo start
# Scan QR code with Expo Go app
```

## ⚙️ Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/sacred-journeys
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

### Web Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

### Mobile App
Update `API_URL` in `mobile/src/services/api.js`

## 🌐 Deployment

### Deploy Backend to Render

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`
4. Add environment variables in Render dashboard
5. Deploy!

### Deploy Web to Netlify

1. Create a new site on [Netlify](https://netlify.com)
2. Connect your GitHub repository
3. Configure:
   - **Base Directory**: `web`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `web/dist`
4. Add environment variables:
   - `VITE_API_URL`: Your Render backend URL
5. Deploy!

### Build Mobile App
```bash
cd mobile
npx expo build:android  # For Android APK
npx expo build:ios      # For iOS (requires Apple Developer account)
```

## 📱 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user |

### Tours
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tours` | Get all tours |
| GET | `/api/tours/:slug` | Get tour by slug |
| POST | `/api/tours` | Create tour (Admin) |
| PUT | `/api/tours/:id` | Update tour (Admin) |
| DELETE | `/api/tours/:id` | Delete tour (Admin) |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings` | Get user bookings |
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/:id` | Get booking details |

### Emergency
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/emergency/trigger` | Trigger emergency alert |
| GET | `/api/emergency` | Get all alerts (Admin) |

### Menu
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/menu/today` | Get today's menu |
| POST | `/api/menu` | Create menu (Admin) |

### Polls
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/polls/active` | Get active polls |
| POST | `/api/polls/:id/vote` | Vote on poll |

## 🔐 User Roles

| Role | Capabilities |
|------|--------------|
| **user** | Book tours, view itinerary, emergency alerts, vote polls |
| **admin** | All user capabilities + manage tours, users, menu, gallery |

## 🌍 Multi-Language Support

The application supports three languages:
- 🇬🇧 **English** (default)
- 🇮🇳 **Hindi** (हिंदी)
- 🇮🇳 **Marathi** (मराठी)

Language files are located in:
- Web: `web/src/i18n/locales/`
- Mobile: `mobile/src/i18n/locales/`

## 🚨 Emergency Alert System

The emergency system includes:
1. **Loud Siren Sound** - Plays when emergency button is pressed
2. **Real-time Admin Notification** - Via Socket.IO
3. **Location Capture** - GPS coordinates sent with alert
4. **SMS/WhatsApp Integration** - Placeholder for Twilio integration

## 📸 Screenshots

### Web Application
| Home | Tours | Admin Dashboard |
|------|-------|-----------------|
| ![Home](https://via.placeholder.com/300x200) | ![Tours](https://via.placeholder.com/300x200) | ![Admin](https://via.placeholder.com/300x200) |

### Mobile App
| Home | My Trip | Emergency |
|------|---------|-----------|
| ![Home](https://via.placeholder.com/150x300) | ![Trip](https://via.placeholder.com/150x300) | ![SOS](https://via.placeholder.com/150x300) |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Icons by [Heroicons](https://heroicons.com) and [Ionicons](https://ionicons.com)
- UI inspiration from modern travel apps
- All the pilgrims and travellers who inspired this project

---

**Built with ❤️ for sacred journeys and cultural exploration**

📧 Contact: [your-email@example.com](mailto:your-email@example.com)
🌐 Website: [https://sacred-journeys.netlify.app](https://sacred-journeys.netlify.app)

