# PostgreSQL Database Setup Guide

## Quick Setup (Recommended)

### Option 1: Using the Setup Script

```bash
cd backend/scripts
./setup-database.sh
```

The script will prompt you for database credentials and set everything up automatically.

### Option 2: Manual Setup

1. **Connect to PostgreSQL as superuser:**
```bash
psql -U postgres
```

2. **Create database and user:**
```sql
-- Create database
CREATE DATABASE ecommerce_db;

-- Create user
CREATE USER ecommerce_user WITH PASSWORD 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE ecommerce_db TO ecommerce_user;
```

3. **Connect to the new database and set schema permissions:**
```sql
\c ecommerce_db

GRANT ALL ON SCHEMA public TO ecommerce_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ecommerce_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ecommerce_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ecommerce_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ecommerce_user;
```

4. **Update your `.env` file:**
```env
DATABASE_URL="postgresql://ecommerce_user:your_secure_password@localhost:5432/ecommerce_db?schema=public"
```

### Option 3: Using SQL File

```bash
psql -U postgres -f backend/scripts/setup-database-simple.sql
```

Then update the `.env` file with the credentials from the SQL file.

## After Database Setup

1. **Run Prisma migrations:**
```bash
cd backend
npx prisma migrate dev --name init
```

2. **Generate Prisma Client:**
```bash
npx prisma generate
```

3. **Seed the database (optional):**
```bash
npm run seed
```

## Troubleshooting

### Error: "User was denied access"
- Make sure the user exists and has proper permissions
- Verify the password in DATABASE_URL matches the user password
- Check that the database exists

### Error: "Database does not exist"
- Create the database first using one of the methods above
- Verify the database name in DATABASE_URL matches the created database

### Error: "Connection refused"
- Make sure PostgreSQL is running: `pg_isready`
- Check PostgreSQL is listening on port 5432
- Verify connection settings in DATABASE_URL

### Testing Connection

Test your database connection:
```bash
psql -U ecommerce_user -d ecommerce_db -h localhost
```

If prompted for a password, enter the password you set for the user.

## Default Credentials (from SQL script)

If you used the simple SQL script:
- **Database**: `ecommerce_db`
- **User**: `ecommerce_user`
- **Password**: `ecommerce_password_2024`

**⚠️ Important**: Change these credentials for production use!

