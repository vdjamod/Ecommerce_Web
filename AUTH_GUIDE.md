# Authentication Guide - Separate Admin & Customer Routes

## 🔐 Authentication Structure

The application now has **separate login and registration pages** for admins and customers.

## 📍 Available Routes

### Customer Authentication
- **Login**: `/login` - Customer login page
- **Registration**: `/register` - Customer registration page
- **Default Role**: `customer`

### Admin Authentication
- **Login**: `/admin/login` - Admin login page
- **Registration**: `/admin/registration` - Admin registration page
- **Default Role**: `admin`

## 🎯 How It Works

### For Customers:

1. **Register as Customer**
   - Go to `/register`
   - Fill in name, email, and password
   - Account is created with `role: 'customer'`
   - Automatically logged in and redirected to products

2. **Login as Customer**
   - Go to `/login`
   - Enter email and password
   - If account exists and password is correct, you're logged in
   - Redirected to products page

### For Admins:

1. **Register as Admin**
   - Go to `/admin/registration`
   - Fill in name, email, and password
   - Confirm password
   - Account is created with `role: 'admin'`
   - Automatically logged in and redirected to admin panel

2. **Login as Admin**
   - Go to `/admin/login`
   - Enter admin email and password
   - System verifies you have admin role
   - If not admin, shows error message
   - If admin, redirected to admin panel

## 🔄 Navigation

### Home Page (`/`)
Shows buttons for:
- Customer Register
- Customer Login
- Admin Login
- Admin Register

### Navigation Bar
- When **not logged in**: Shows "Admin" link (red) that goes to `/admin/login`
- When **logged in as customer**: Shows customer features
- When **logged in as admin**: Shows admin features (Admin, Reports links)

## 🛡️ Security Features

### Admin Login Protection
- Admin login page checks if the logged-in user has `role: 'admin'`
- If a customer tries to login via admin page, they get an error
- Only admins can access `/admin` and `/reports` pages

### Role-Based Access
- Customer accounts: Can browse, add to cart, checkout, view orders
- Admin accounts: Can do everything customers can + manage products + view reports

## 📋 API Endpoints

### Customer Registration
```
POST /api/auth/register
Body: { name, email, password }
Response: { user, token }
Role: customer
```

### Admin Registration
```
POST /api/auth/admin/register
Body: { name, email, password }
Response: { user, token }
Role: admin
```

### Login (Both)
```
POST /api/auth/login
Body: { email, password }
Response: { user, token }
Works for both customers and admins
```

## 🎨 Visual Differences

### Customer Pages
- Blue theme (blue borders, blue buttons)
- Title: "Customer Login" / "Customer Registration"
- Blue accent colors

### Admin Pages
- Red theme (red borders, red buttons)
- Title: "Admin Login" / "Admin Registration"
- Red accent colors
- Warning message about admin access

## 🚀 Quick Start

### Create Your First Admin Account:

1. Go to `/admin/registration`
2. Fill in:
   - Name: Your full name
   - Email: admin@example.com
   - Password: (minimum 6 characters)
   - Confirm Password: (same as password)
3. Click "Register as Admin"
4. You'll be automatically logged in and redirected to `/admin`

### Create Customer Account:

1. Go to `/register`
2. Fill in name, email, and password
3. Click "Register"
4. You'll be automatically logged in and redirected to `/products`

## 🔍 Testing

### Test Customer Flow:
1. Register at `/register`
2. Logout
3. Login at `/login`
4. Browse products, add to cart, checkout

### Test Admin Flow:
1. Register at `/admin/registration`
2. Logout
3. Login at `/admin/login`
4. Go to `/admin` to manage products
5. Go to `/reports` to view analytics

### Test Security:
1. Register as customer
2. Try to access `/admin/login` - should work (login page)
3. Login as customer via admin login page - should show error
4. Try to access `/admin` directly - should redirect (if protected)

## 📝 Notes

- **Same Login Endpoint**: Both customers and admins use the same `/api/auth/login` endpoint
- **Different Registration**: Customers use `/api/auth/register`, Admins use `/api/auth/admin/register`
- **Role Verification**: Admin login page verifies role after login
- **Automatic Redirect**: After registration/login, users are redirected based on their role
- **Visual Distinction**: Admin pages have red theme, customer pages have blue theme

## 🐛 Troubleshooting

### Can't access admin panel after admin registration?
- Check browser console for errors
- Verify the user role in database: `SELECT * FROM users WHERE email = 'your_email';`
- Try logging out and back in

### Admin login shows "not an admin" error?
- The account you're using doesn't have admin role
- Register a new admin account at `/admin/registration`
- Or update existing user in database: `UPDATE users SET role = 'admin' WHERE email = 'your_email';`

### Customer can't login via admin page?
- This is expected behavior - admin login page checks for admin role
- Customers should use `/login` instead

