# Vrinda Jasmine - B2B Hospitality Equipment Marketplace

A comprehensive Next.js platform connecting hospitality equipment suppliers with buyers across India.

## Features

- **B2B Marketplace**: Connect verified suppliers with quality-conscious buyers
- **Product Management**: Dynamic product forms with category-specific fields
- **Admin Dashboard**: Complete admin panel for platform management
- **User Authentication**: Secure authentication with role-based access
- **Product Approval System**: Admin approval workflow for quality control
- **Responsive Design**: Modern UI optimized for all devices

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **File Upload**: Cloudinary integration
- **Deployment**: Vercel

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run database migrations: `npx prisma db push`
5. Start development server: `npm run dev`

## Environment Variables

Create a `.env.local` file with:

```env
DATABASE_URL="your-postgresql-url"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

## Deployment

The application is configured for deployment on Vercel with automatic builds and deployments.

---

**Latest Update**: ESLint configuration updated for successful deployment