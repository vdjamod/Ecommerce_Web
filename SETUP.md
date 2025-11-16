# Quick Setup Guide

## Prerequisites
- Node.js 18+ installed
- PostgreSQL running and accessible
- MongoDB running and accessible

## Step-by-Step Setup

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_this
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_db?schema=public"
MONGODB_URI="mongodb://localhost:27017/ecommerce"
```

Set up database:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

Seed database (optional):
```bash
npm run seed
```

Start backend:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm run dev
```

### 3. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### 4. Test Credentials (after seeding)

**Admin:**
- Email: admin@example.com
- Password: admin123

**Customer:**
- Email: customer@example.com
- Password: customer123

## Running Tests

```bash
cd backend
npm run test
```

## Important Notes

1. Make sure both PostgreSQL and MongoDB are running before starting the application
2. Update the database connection strings in `.env` to match your setup
3. The seed script creates sample data including admin and customer users
4. For production, change the JWT_SECRET to a strong random string

