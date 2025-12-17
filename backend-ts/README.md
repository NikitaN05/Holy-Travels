# Holy Travels API

Production-ready backend for Holy Travels - a spiritual and historic tour booking platform.

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT (access + refresh tokens)
- **Realtime**: Socket.IO
- **File Uploads**: Cloudinary
- **Validation**: Zod
- **Logging**: Pino
- **Documentation**: Swagger/OpenAPI

## 📁 Project Structure

```
backend-ts/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed script
├── src/
│   ├── config/            # Configuration
│   ├── controllers/       # Route handlers
│   ├── jobs/              # Cron jobs
│   ├── middleware/        # Express middleware
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── sockets/           # Socket.IO
│   ├── utils/             # Utilities
│   ├── validators/        # Zod schemas
│   └── server.ts          # Entry point
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
# Start PostgreSQL and API
docker-compose up -d

# Run migrations
docker-compose exec api npx prisma migrate deploy

# Seed database
docker-compose exec api npm run db:seed
```

### Option 2: Local Development

```bash
# Install dependencies
npm install

# Copy environment file
cp env.example.txt .env
# Edit .env with your values

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Start development server
npm run dev
```

## 📝 Environment Variables

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/holy_travels"

# JWT (generate with: openssl rand -base64 64)
JWT_ACCESS_SECRET="your-32-char-secret"
JWT_REFRESH_SECRET="your-32-char-secret"
JWT_ACCESS_EXPIRES="15m"
JWT_REFRESH_EXPIRES="7d"

# Server
PORT=4000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

## 🔑 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register traveller |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh tokens |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |

### Tours (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tours` | List tours |
| GET | `/api/tours/featured` | Featured tours |
| GET | `/api/tours/:id` | Tour details |
| GET | `/api/tours/:id/itinerary` | Tour itinerary (auth) |
| GET | `/api/tours/:id/photos` | Tour photos |
| POST | `/api/tours/:id/photos` | Upload photo (active booking) |

### Bookings (Traveller)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/me` | My bookings |
| GET | `/api/bookings/:id` | Booking details |
| POST | `/api/bookings/:id/cancel` | Cancel booking |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications/me` | My notifications |
| GET | `/api/notifications/unread-count` | Unread count |
| PATCH | `/api/notifications/:id/read` | Mark as read |
| POST | `/api/notifications/read-all` | Mark all read |

### Owner/Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/owner/tours` | All tours |
| POST | `/api/owner/tours` | Create tour |
| PATCH | `/api/owner/tours/:id` | Update tour |
| DELETE | `/api/owner/tours/:id` | Delete tour |
| POST | `/api/owner/tours/:id/dates` | Add tour date |
| POST | `/api/owner/tours/:id/itinerary` | Add itinerary |
| POST | `/api/owner/tours/:id/emergency-alerts` | Send alert |
| GET | `/api/owner/bookings` | All bookings |
| PATCH | `/api/owner/bookings/:id` | Update status |

## 📖 API Documentation

Visit `http://localhost:4000/api/docs` for interactive Swagger documentation.

## 🔌 Socket.IO Events

### Connection
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000', {
  auth: { token: 'your-access-token' }
});
```

### Events (Client listens)
- `notification:new` - New notification
- `emergency:new` - Emergency alert
- `itinerary:updated` - Itinerary change

### Events (Client emits)
- `join:tour` - Join tour room
- `leave:tour` - Leave tour room

## 🔒 Default Credentials

After seeding:
- **Owner**: owner@holytravels.com / Owner@123
- **Traveller**: rahul@example.com / Traveller@123

## 📦 Deployment

### Railway/Render
1. Connect your repository
2. Set environment variables
3. Build command: `npm run build && npx prisma migrate deploy`
4. Start command: `npm start`

### Docker Production
```bash
docker build -t holy-travels-api .
docker run -p 4000:4000 --env-file .env holy-travels-api
```

---

# 🔗 Frontend Integration Guide

## Setup

### 1. Install dependencies

```bash
npm install axios socket.io-client
```

### 2. Environment variables

```env
REACT_APP_API_URL=http://localhost:4000/api
REACT_APP_SOCKET_URL=http://localhost:4000
```

### 3. Create API client

```typescript
// src/services/api.ts
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Request interceptor - add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const { data } = await axios.post(`${API_URL}/auth/refresh`, {}, {
          withCredentials: true
        });
        
        localStorage.setItem('accessToken', data.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

### 4. Auth functions

```typescript
// src/services/auth.ts
import api from './api';

export const login = async (email: string, password: string) => {
  const { data } = await api.post('/auth/login', { email, password });
  localStorage.setItem('accessToken', data.data.accessToken);
  return data.data.user;
};

export const register = async (userData: {
  email: string;
  password: string;
  fullName: string;
  displayName?: string;
  phone?: string;
}) => {
  const { data } = await api.post('/auth/register', userData);
  localStorage.setItem('accessToken', data.data.accessToken);
  return data.data.user;
};

export const logout = async () => {
  await api.post('/auth/logout');
  localStorage.removeItem('accessToken');
};

export const getMe = async () => {
  const { data } = await api.get('/auth/me');
  return data.data.user;
};
```

### 5. Socket.IO client

```typescript
// src/services/socket.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connectSocket = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  
  socket = io(process.env.REACT_APP_SOCKET_URL!, {
    auth: { token },
    transports: ['websocket'],
  });
  
  socket.on('connect', () => {
    console.log('Socket connected');
  });
  
  socket.on('notification:new', (notification) => {
    // Handle new notification
    console.log('New notification:', notification);
    // Show toast, update badge, etc.
  });
  
  socket.on('emergency:new', (alert) => {
    // Handle emergency alert
    console.log('Emergency:', alert);
    // Show prominent alert
  });
  
  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};

export const joinTourRoom = (tourId: string) => {
  socket?.emit('join:tour', tourId);
};

export const leaveTourRoom = (tourId: string) => {
  socket?.emit('leave:tour', tourId);
};

export const getSocket = () => socket;
```

### 6. Example: Tours list

```typescript
// src/pages/Tours.tsx
import { useEffect, useState } from 'react';
import api from '../services/api';

interface Tour {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  durationDays: number;
  images: string[];
  category: string;
}

export default function Tours() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const { data } = await api.get('/tours', {
          params: { page: 1, limit: 10 }
        });
        setTours(data.data);
      } catch (error) {
        console.error('Failed to fetch tours:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTours();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {tours.map((tour) => (
        <div key={tour.id} className="border rounded-lg p-4">
          <img 
            src={tour.images[0]} 
            alt={tour.title}
            className="w-full h-48 object-cover rounded"
          />
          <h3 className="text-xl font-bold mt-2">{tour.title}</h3>
          <p className="text-gray-600">{tour.subtitle}</p>
          <div className="flex justify-between mt-4">
            <span>₹{tour.price}</span>
            <span>{tour.durationDays} days</span>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### 7. Example: Create booking

```typescript
// src/services/bookings.ts
import api from './api';

export const createBooking = async (bookingData: {
  tourDateId: string;
  numberOfTravellers: number;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  specialRequests?: string;
}) => {
  const { data } = await api.post('/bookings', bookingData);
  return data.data.booking;
};

export const getMyBookings = async () => {
  const { data } = await api.get('/bookings/me');
  return data.data;
};

export const cancelBooking = async (bookingId: string) => {
  const { data } = await api.post(`/bookings/${bookingId}/cancel`);
  return data.data.booking;
};
```

### 8. Notifications hook

```typescript
// src/hooks/useNotifications.ts
import { useEffect, useState } from 'react';
import api from '../services/api';
import { getSocket } from '../services/socket';

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    // Fetch initial notifications
    api.get('/notifications/me').then(({ data }) => {
      setNotifications(data.data.notifications);
      setUnreadCount(data.data.unreadCount);
    });
    
    // Listen for new notifications
    const socket = getSocket();
    socket?.on('notification:new', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });
    
    return () => {
      socket?.off('notification:new');
    };
  }, []);
  
  const markAsRead = async (id: string) => {
    await api.patch(`/notifications/${id}/read`);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };
  
  return { notifications, unreadCount, markAsRead };
}
```

## 🔐 Role-Based UI

```typescript
// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../services/auth';
import { connectSocket, disconnectSocket } from '../services/socket';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      getMe()
        .then((user) => {
          setUser(user);
          connectSocket();
        })
        .catch(() => {
          localStorage.removeItem('accessToken');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);
  
  const isOwner = user?.role === 'OWNER';
  const isTraveller = user?.role === 'TRAVELLER';
  
  return (
    <AuthContext.Provider value={{ user, setUser, isOwner, isTraveller, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

## 📱 Response Format

All API responses follow this format:

```json
// Success
{
  "success": true,
  "data": { ... },
  "message": "Optional message",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}

// Error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "errors": {
      "email": ["Invalid email address"]
    }
  }
}
```

---

Built with ❤️ for Holy Travels

