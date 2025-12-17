// Swagger/OpenAPI configuration

import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Holy Travels API',
      version: '1.0.0',
      description: `
## Holy Travels Backend API

A production-ready API for managing spiritual travel tours.

### Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
\`\`\`
Authorization: Bearer <your-access-token>
\`\`\`

### Roles
- **OWNER**: Admin/operator role - can manage tours, view all bookings, send alerts
- **TRAVELLER**: Consumer role - can book tours, view itineraries, upload photos

### Rate Limiting
- 100 requests per 15 minutes for general endpoints
- 5 requests per 15 minutes for auth endpoints
      `,
      contact: {
        name: 'Holy Travels Support',
        email: 'support@holytravels.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:4000/api',
        description: 'Development server',
      },
      {
        url: 'https://api.holytravels.com/api',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string', example: 'VALIDATION_ERROR' },
                message: { type: 'string', example: 'Validation failed' },
                errors: {
                  type: 'object',
                  additionalProperties: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                },
              },
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['OWNER', 'TRAVELLER'] },
            fullName: { type: 'string' },
            displayName: { type: 'string' },
            phone: { type: 'string' },
            avatarUrl: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        PublicUser: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            displayName: { type: 'string' },
            avatarUrl: { type: 'string' },
          },
        },
        Tour: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            subtitle: { type: 'string' },
            description: { type: 'string' },
            durationDays: { type: 'integer' },
            price: { type: 'number' },
            currency: { type: 'string' },
            locations: { type: 'array', items: { type: 'string' } },
            images: { type: 'array', items: { type: 'string' } },
            highlights: { type: 'array', items: { type: 'string' } },
            inclusions: { type: 'array', items: { type: 'string' } },
            exclusions: { type: 'array', items: { type: 'string' } },
            category: { type: 'string', enum: ['pilgrimage', 'historic', 'cultural', 'mixed'] },
            status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] },
            isFeatured: { type: 'boolean' },
          },
        },
        CreateTour: {
          type: 'object',
          required: ['title', 'description', 'durationDays', 'price'],
          properties: {
            title: { type: 'string', minLength: 3 },
            subtitle: { type: 'string' },
            description: { type: 'string', minLength: 10 },
            durationDays: { type: 'integer', minimum: 1 },
            price: { type: 'number', minimum: 0 },
            currency: { type: 'string', default: 'INR' },
            locations: { type: 'array', items: { type: 'string' } },
            images: { type: 'array', items: { type: 'string', format: 'uri' } },
            highlights: { type: 'array', items: { type: 'string' } },
            inclusions: { type: 'array', items: { type: 'string' } },
            exclusions: { type: 'array', items: { type: 'string' } },
            category: { type: 'string', enum: ['pilgrimage', 'historic', 'cultural', 'mixed'] },
            status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] },
            isFeatured: { type: 'boolean' },
          },
        },
        UpdateTour: {
          type: 'object',
          properties: {
            title: { type: 'string', minLength: 3 },
            subtitle: { type: 'string' },
            description: { type: 'string', minLength: 10 },
            durationDays: { type: 'integer', minimum: 1 },
            price: { type: 'number', minimum: 0 },
            status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] },
          },
        },
        Booking: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            tourDateId: { type: 'string' },
            status: { type: 'string', enum: ['PENDING', 'CONFIRMED', 'CANCELLED'] },
            numberOfTravellers: { type: 'integer' },
            totalAmount: { type: 'number' },
            contactName: { type: 'string' },
            contactPhone: { type: 'string' },
            contactEmail: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        ItineraryItem: {
          type: 'object',
          required: ['dayNumber', 'title'],
          properties: {
            dayNumber: { type: 'integer', minimum: 1 },
            title: { type: 'string' },
            description: { type: 'string' },
            scheduledTime: { type: 'string', format: 'date-time' },
            location: { type: 'string' },
            notes: { type: 'string' },
            isEmergencyRelevant: { type: 'boolean' },
          },
        },
        Notification: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            type: { type: 'string', enum: ['ITINERARY_UPDATE', 'ITINERARY_REMINDER', 'EMERGENCY_ALERT', 'BOOKING_UPDATE', 'GENERAL'] },
            title: { type: 'string' },
            message: { type: 'string' },
            isRead: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    tags: [
      { name: 'Authentication', description: 'Auth endpoints' },
      { name: 'Tours', description: 'Public tour endpoints' },
      { name: 'Bookings', description: 'Traveller booking endpoints' },
      { name: 'Notifications', description: 'User notification endpoints' },
      { name: 'Photos', description: 'Photo upload endpoints' },
      { name: 'Owner - Tours', description: 'Owner tour management' },
      { name: 'Owner - Bookings', description: 'Owner booking management' },
      { name: 'Owner - Itinerary', description: 'Owner itinerary management' },
      { name: 'Owner - Emergency', description: 'Emergency alerts' },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);

