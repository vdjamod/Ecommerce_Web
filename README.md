# E-Commerce Full-Stack Application

A production-ready full-stack E-Commerce Web Application built with Node.js, Express.js, Next.js, PostgreSQL, and MongoDB following the MVC pattern.

## Overview

This application demonstrates a complete e-commerce solution with:
- User authentication and authorization (JWT-based)
- Product management (MongoDB)
- Shopping cart functionality
- Order processing (PostgreSQL)
- Admin dashboard
- Reports and analytics
- Server-side sorting, filtering, and pagination

## Key Features

- **Authentication**: Secure registration, login, and logout with JWT tokens and bcrypt password hashing
- **Role-Based Access**: Admin and customer roles with appropriate permissions
- **Product Management**: Full CRUD operations for products (admin only)
- **Product Listing**: Search, category filtering, pagination, and server-side sorting
- **Shopping Cart**: Add, remove, and update cart items
- **Checkout**: Order creation with server-side total calculation
- **Reports**: SQL aggregations (daily revenue, top customers) and MongoDB aggregations (category statistics)
- **Responsive Design**: Modern UI with Tailwind CSS

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js (MVC structure)
- **SQL Database**: PostgreSQL with Prisma ORM
- **NoSQL Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcrypt password hashing
- **Validation**: express-validator
- **Testing**: Jest

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API

### Deployment
- Backend and frontend can be deployed to Vercel, Render, Railway, AWS, Azure, or any compatible service

## Project Structure

```
.
├── backend/
│   ├── config/
│   │   ├── database.js      # Database connections
│   │   └── auth.js          # JWT utilities
│   ├── controllers/
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   └── reportController.js
│   ├── middleware/
│   │   └── auth.js          # Authentication middleware
│   ├── models/
│   │   └── Product.js       # MongoDB product model
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   └── reports.js
│   ├── tests/
│   │   ├── auth.test.js
│   │   └── productSorting.test.js
│   ├── prisma/
│   │   └── schema.prisma    # Prisma schema
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── app/                 # Next.js App Router pages
│   │   ├── page.tsx
│   │   ├── login/
│   │   ├── register/
│   │   ├── products/
│   │   ├── cart/
│   │   ├── orders/
│   │   ├── admin/
│   │   └── reports/
│   ├── components/
│   │   └── Navbar.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── lib/
│   │   └── api.ts           # API client functions
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database
- MongoDB database
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the `backend` directory:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_change_this_in_production
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_db?schema=public"
MONGODB_URI="mongodb://localhost:27017/ecommerce"
```

4. Set up PostgreSQL database:
```bash
# Run Prisma migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

5. Start the backend server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Database Configuration

### PostgreSQL Schema

The application uses Prisma for PostgreSQL schema management. The schema includes:

- **users**: User accounts with authentication
- **orders**: Order records
- **order_items**: Individual items in orders

Run migrations:
```bash
cd backend
npx prisma migrate dev
```

### MongoDB Schema

Products are stored in MongoDB with the following structure:
- sku (indexed)
- name
- price
- category (indexed)
- description
- image
- stock
- updatedAt (indexed)

## Testing

### Testing Framework
The application uses **Jest** for testing.

### Running Tests
```bash
cd backend
npm run test
```

### Test Coverage
The test suite includes:
- **Authentication Tests** (`tests/auth.test.js`): Verifies password hashing, user creation, and JWT token generation/verification
- **Product Sorting Tests** (`tests/productSorting.test.js`): Verifies that product sorting returns items in descending order by default and can handle alternate request conditions (ascending order)

### Test Description
The product sorting test verifies that the product sorting function returns items in descending order by default and can handle alternate request conditions. It tests:
- Default descending price sort
- Ascending price sort
- Sorting with category filter
- Sorting with search filter

## API Routes

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products (with query params: page, limit, category, search, sortBy, sortOrder)
- `GET /api/products/categories` - Get all categories
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart
- `GET /api/cart` - Get user's cart (authenticated)
- `POST /api/cart` - Add item to cart (authenticated)
- `PUT /api/cart/:productId` - Update cart item quantity (authenticated)
- `DELETE /api/cart/:productId` - Remove item from cart (authenticated)
- `DELETE /api/cart` - Clear cart (authenticated)

### Orders
- `POST /api/orders` - Create order from cart (authenticated)
- `GET /api/orders` - Get user's orders (authenticated)
- `GET /api/orders/:id` - Get single order (authenticated)

### Reports
- `GET /api/reports` - Get all reports (authenticated, admin only)
- `GET /api/reports/daily-revenue` - Get daily revenue (authenticated, admin only)
- `GET /api/reports/top-customers` - Get top customers (authenticated, admin only)
- `GET /api/reports/category-sales` - Get category-wise sales (authenticated, admin only)

## Frontend Routes

- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/products` - Product listing with filters and pagination
- `/cart` - Shopping cart
- `/orders` - User's order history
- `/admin` - Admin product management (admin only)
- `/reports` - Reports and analytics (admin only)

## Server-Side Sorting

The product listing endpoint supports server-side sorting that can be controlled via:
- Query parameters: `sortBy` and `sortOrder`
- Special header: `x-sort-ascending: true` (forces ascending order)

The sorting logic is implemented entirely on the server side, ensuring consistent results regardless of client-side manipulation.

## Security Features

- JWT-based authentication
- Bcrypt password hashing
- Input validation on all endpoints
- Role-based access control
- Protected routes with authentication middleware
- Environment variables for sensitive data

## Performance Optimizations

- Database indexes on frequently queried fields (sku, category, updatedAt)
- Pagination for large datasets
- Efficient MongoDB aggregations
- Optimized SQL queries with Prisma

## Deployment URLs

**Note**: Update these with your actual deployment URLs before submission.

- Frontend: [Your Frontend URL]
- Backend API: [Your Backend URL]

## Admin Login Credentials

For evaluation purposes:

- **Email**: admin@example.com
- **Password**: admin123

**Note**: You should create an admin user in your database. To create an admin user, you can either:
1. Manually update a user's role to 'admin' in the database
2. Use a database seed script
3. Register normally and update via database

## Seed Data

To populate the database with initial data, you can create a seed script or manually add:
- At least one admin user
- Sample products in various categories
- Sample orders for testing reports

## Notes

- All credentials and secrets are stored in `.env` files and should never be committed to version control
- The application uses in-memory cart storage (in production, consider Redis or database storage)
- Ensure both databases (PostgreSQL and MongoDB) are running before starting the application
- The application follows clean code principles with meaningful commit messages

## License

This project is created for educational purposes.

# Ecommerce_Web
