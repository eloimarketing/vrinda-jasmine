# API Documentation

## 1. Authentication APIs

### POST `/api/auth/[...nextauth]`
- **Description**: Handles authentication using NextAuth.js
- **Authentication**: Required
- **Response**: JSON with authentication status

### POST `/api/auth/register`
- **Description**: User registration endpoint
- **Request Body**: 
  ```typescript
  {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    countryCode: string,
    phoneNumber: string,
    role: 'SELLER' | 'BUYER'
  }
  ```
- **Response**: 
  ```typescript
  {
    message: string,
    userId: string
  }
  ```

## 2. Health Check API

### GET `/api/health`
- **Description**: Application health check
- **Response**: 
  ```typescript
  {
    server: string,
    prisma: string,
    database: string,
    timestamp: string
  }
  ```

## 3. Profile Management

### PATCH `/api/profile/update`
- **Description**: Update user profile
- **Authentication**: Required
- **Request Body**: 
  ```typescript
  {
    firstName: string,
    lastName: string,
    email: string,
    countryCode: string,
    phoneNumber: string,
    profilePicture?: File
  }
  ```
- **Response**: 
  ```typescript
  {
    message: string,
    user: User
  }
  ```

## 4. Admin Endpoints

### `/api/admin/...`
- **Description**: Admin-specific endpoints
- **Note**: Contains 2 endpoints (details not available)

## 5. User Endpoints

### `/api/user/...`
- **Description**: User-related endpoints
- **Note**: Contains user-specific endpoints (details not available)

## 6. Seller Endpoints

### `/api/seller/property`
- **Description**: Seller property management
- **Note**: Currently not implemented

## Error Responses

All endpoints may return the following error responses:

```typescript
{
  message: string,
  status: number
}
```

## Authentication

- Most endpoints require authentication
- Authentication is handled through NextAuth.js
- User roles: ADMIN, CUSTOMER, SUPPLIER

## Database Integration

- All endpoints use Prisma ORM
- Database: PostgreSQL
- Models: User, Item, Order, Inquiry, Cart, Wishlist
