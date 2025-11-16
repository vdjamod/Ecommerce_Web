# PostgreSQL Connection Information

## Your PostgreSQL Setup

### Current Configuration
- **System User**: `hbsolanki.07` (Superuser - no password required)
- **Database**: `ecommerce_db`
- **Connection**: Works without password (common on macOS)

### Connection String
```
postgresql://hbsolanki.07@localhost:5432/ecommerce_db?schema=public
```

## Why No Password?

On macOS, when PostgreSQL is installed via Homebrew, it's configured to use "peer authentication" for local connections. This means:
- Your system username (`hbsolanki.07`) can connect without a password
- This is secure because only you (logged into your Mac) can use it
- No password needed for local development

## Alternative: Using a Password

If you want to use a password-protected user instead:

### Option 1: Set password for your system user
```bash
psql -d postgres
ALTER USER "hbsolanki.07" WITH PASSWORD 'your_password';
```
Then use: `postgresql://hbsolanki.07:your_password@localhost:5432/ecommerce_db?schema=public`

### Option 2: Use the ecommerce_user we created
The `ecommerce_user` already exists with password `ecommerce_password_2024`
```bash
DATABASE_URL="postgresql://ecommerce_user:ecommerce_password_2024@localhost:5432/ecommerce_db?schema=public"
```

## Testing Your Connection

Test connection without password:
```bash
psql -d ecommerce_db
```

Test with Prisma:
```bash
cd backend
npx prisma db pull
```

## Current Database Status

✅ Database: `ecommerce_db` exists
✅ Tables created: users, orders, order_items
✅ Connection working: No password needed

## Troubleshooting

### If connection fails:
1. Make sure PostgreSQL is running: `pg_isready`
2. Check database exists: `psql -l | grep ecommerce_db`
3. Verify user: `psql -d postgres -c "\du"`

### If you want to reset:
```bash
# Drop and recreate database
psql -d postgres -c "DROP DATABASE IF EXISTS ecommerce_db;"
psql -d postgres -c "CREATE DATABASE ecommerce_db;"
cd backend
npx prisma migrate dev
```

