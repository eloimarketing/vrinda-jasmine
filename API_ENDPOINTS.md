# API Endpoints for Vrinda Jasmine B2B Platform

---

## Authentication

### POST `/api/auth/register`
Registers a new user.
- **Auth:** No
- **Body:** (multipart/form-data)
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "secure123",
  "countryCode": "+91",
  "phoneNumber": "9876543210",
  "isSeller": "true|false",
  "profilePicture": File (optional)
}
```
- **Response:**
```json
{
  "message": "User registered successfully",
  "userId": "clx123abc"
}
```

---

### POST/GET `/api/auth/[...nextauth]`
Handles authentication (login, session, etc.) via NextAuth.js.
- **Auth:** No (used for login/session)
- **Body:** Varies by provider
- **Response:** Varies by provider

---

## Profile

### PUT `/api/profile/update`
Update the authenticated user's profile.
- **Auth:** Yes (session required)
- **Body:** (multipart/form-data)
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "countryCode": "+91",
  "phoneNumber": "9876543210",
  "profilePicture": File (optional)
}
```
- **Response:**
```json
{
  "message": "Profile updated successfully",
  "userId": "clx123abc"
}
```

---

## Cart

### POST `/api/user/cart/add`
Add a property to the user's cart.
- **Auth:** Yes (session required)
- **Body:** (application/json)
```json
"propertyId"
```
- **Response:**
```json
{
  "cart": { /* cart object */ },
  "message": "Property added to cart successfully"
}
```

---

## Seller

### POST `/api/seller/property/create`
Create a new property listing (various property types supported).
- **Auth:** Yes (session required)
- **Body:** (multipart/form-data)
```json
{
  "propertyType": "Apartment_Flat|Independent_House_Villa|Plot_Land|...",
  // plus many property-specific fields (see code for full schema)
}
```
- **Response:**
```json
{
  "validatedPropertyInfo": { /* validated property data */ },
  "imgUrls": [ /* image upload results */ ],
  "videoUrls": [ /* video upload results */ ],
  "createdData": { /* created property object */ }
}
```

---

## Admin

### POST `/api/admin/property/approve`
Approve a property listing (by propertyId).
- **Auth:** Should be admin (not enforced in code, but implied)
- **Body:** (application/json)
```json
{
  "propertyId": "clx123abc"
}
```
- **Response:**
```json
{
  /* updated property object */
}
```

### GET `/api/admin/property/approve/[id]`
Check if a property is approved.
- **Auth:** Should be admin (not enforced in code, but implied)
- **Response:**
```json
{
  "isApproved": true
}
```

---

*This file is auto-generated from the codebase. For full request/response details, see the actual route files in `app/api/`.* 