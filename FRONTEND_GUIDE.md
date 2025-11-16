# Frontend Routes & Features Guide

## 🚀 Quick Start

### 1. Start the Application

**Backend:**

```bash
cd backend
npm run dev
```

Backend runs on: `http://localhost:5000`

**Frontend:**

```bash
cd frontend
npm run dev
```

Frontend runs on: `http://localhost:3000`

## 📄 All Available Pages

### Public Pages (No Login Required)

| Route            | Description                      | Access   |
| ---------------- | -------------------------------- | -------- |
| `/`              | Home page with welcome message   | Everyone |
| `/products`      | Browse all products with filters | Everyone |
| `/products/[id]` | View single product details      | Everyone |
| `/login`         | User login page                  | Everyone |
| `/register`      | User registration page           | Everyone |
| `/api-routes`    | Complete API documentation       | Everyone |

### Customer Pages (Login Required)

| Route     | Description              | Access          |
| --------- | ------------------------ | --------------- |
| `/cart`   | Shopping cart management | Logged in users |
| `/orders` | View order history       | Logged in users |

### Admin Pages (Admin Role Required)

| Route      | Description                 | Access     |
| ---------- | --------------------------- | ---------- |
| `/admin`   | Product management (CRUD)   | Admin only |
| `/reports` | Sales reports and analytics | Admin only |

## 👤 User Workflow

### For Regular Customers:

1. **Register/Login**

   - Go to `/register` to create an account
   - Or go to `/login` if you already have an account
   - Default role: `customer`

2. **Browse Products**

   - Visit `/products` to see all products
   - Use search, category filter, and sorting
   - Click on any product to see details

3. **Shopping Cart**

   - Add products to cart from product pages
   - View cart at `/cart`
   - Update quantities or remove items
   - Proceed to checkout

4. **Orders**
   - After checkout, orders are created
   - View all orders at `/orders`
   - See order details and history

## 👑 Admin Workflow

### For Administrators:

1. **Login as Admin**

   - Login with an admin account
   - Admin accounts have `role: 'admin'`

2. **Manage Products** (`/admin`)

   - Click "Add Product" button
   - Fill in product details:
     - SKU (unique identifier)
     - Name
     - Price
     - Category
     - Description (optional)
     - Image URL (optional)
     - Stock quantity
   - Click "Create" to add product
   - Edit existing products by clicking "Edit"
   - Delete products by clicking "Delete"

3. **View Reports** (`/reports`)
   - Daily revenue (last 30 days)
   - Top customers by spending
   - Category-wise statistics

## 🔑 Creating an Admin Account

### Option 1: Using Seed Script (Recommended)

```bash
cd backend
npm run seed
```

This creates:

- Admin: `admin@example.com` / `admin123`
- Customer: `customer@example.com` / `customer123`

### Option 2: Manual Database Update

1. Register a normal account
2. Update the user's role in PostgreSQL:

```sql
psql -d ecommerce_db
UPDATE users SET role = 'admin' WHERE email = 'your_email@example.com';
```

### Option 3: Direct Registration (if you modify backend)

You can temporarily modify the registration route to allow setting admin role.

## 📋 Navigation Bar Features

The navigation bar shows different options based on login status:

**Not Logged In:**

- Products
- API Docs
- Login
- Register

**Logged In as Customer:**

- Products
- API Docs
- Cart
- Orders
- Hello, [Your Name]
- Logout

**Logged In as Admin:**

- Products
- API Docs
- Cart
- Orders
- **Admin** (link to admin panel)
- **Reports** (link to reports)
- Hello, [Your Name]
- Logout

## 🛠️ Admin Features Explained

### Product Management (`/admin`)

**Add Product:**

1. Click "Add Product" button
2. Fill the form:
   - **SKU**: Unique product code (e.g., "LAP001")
   - **Name**: Product name (e.g., "Laptop Pro 15")
   - **Price**: Product price (e.g., 1299.99)
   - **Category**: Product category (e.g., "Electronics")
   - **Description**: Optional product description
   - **Image URL**: Optional image URL
   - **Stock**: Available quantity
3. Click "Create"

**Edit Product:**

1. Find the product in the table
2. Click "Edit" button
3. Modify the fields (SKU cannot be changed)
4. Click "Update"

**Delete Product:**

1. Find the product in the table
2. Click "Delete" button
3. Confirm deletion

### Reports (`/reports`)

**Daily Revenue:**

- Shows revenue for the last 30 days
- SQL aggregation query
- Displays date, order count, and total revenue

**Top Customers:**

- Shows top 10 customers by total spending
- SQL aggregation query
- Displays name, email, order count, and total spent

**Category Statistics:**

- MongoDB aggregation
- Shows products per category
- Average price, total stock per category

## 🔌 API Documentation

Visit `/api-routes` for complete API documentation including:

- All available endpoints
- Request/response formats
- Authentication requirements
- Example URLs
- Copy-to-clipboard functionality
- Your current authentication status

## 🐛 Troubleshooting

### Can't see Admin/Reports links?

- Make sure you're logged in with an admin account
- Check your user role in the database
- Try logging out and back in

### Products not showing?

- Make sure backend server is running
- Check MongoDB connection
- Verify products exist in database

### Can't add products?

- Make sure you're logged in as admin
- Check browser console for errors
- Verify backend API is accessible

### Authentication issues?

- Clear browser localStorage
- Try logging out and back in
- Check backend JWT_SECRET is set

## 📱 Testing the Application

### Test as Customer:

1. Register at `/register`
2. Login at `/login`
3. Browse products at `/products`
4. Add items to cart
5. Checkout and create order
6. View orders at `/orders`

### Test as Admin:

1. Login with admin account
2. Go to `/admin` to manage products
3. Add, edit, delete products
4. View reports at `/reports`
5. Check analytics and statistics

## 🎯 Key Features

✅ **Authentication**: Secure JWT-based login system
✅ **Product Management**: Full CRUD for admins
✅ **Shopping Cart**: Add, update, remove items
✅ **Order Processing**: Server-side total calculation
✅ **Reports**: SQL and MongoDB aggregations
✅ **Search & Filter**: Product search and category filtering
✅ **Pagination**: Efficient data loading
✅ **Server-side Sorting**: Configurable product sorting
✅ **Responsive Design**: Works on all devices

## 📞 Quick Links

- **Home**: http://localhost:3000
- **Products**: http://localhost:3000/products
- **Login**: http://localhost:3000/login
- **Register**: http://localhost:3000/register
- **Admin Panel**: http://localhost:3000/admin (admin only)
- **Reports**: http://localhost:3000/reports (admin only)
- **API Docs**: http://localhost:3000/api-routes
