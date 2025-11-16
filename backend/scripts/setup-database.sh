#!/bin/bash

# PostgreSQL Database Setup Script
# This script creates the database and user for the e-commerce application

echo "Setting up PostgreSQL database for E-Commerce application..."

# Default values (you can modify these)
DB_NAME="ecommerce_db"
DB_USER="ecommerce_user"
DB_PASSWORD="ecommerce_password_2024"

# Check if PostgreSQL is running
if ! pg_isready -q; then
    echo "Error: PostgreSQL is not running. Please start PostgreSQL first."
    exit 1
fi

# Prompt for database credentials
read -p "Database name [$DB_NAME]: " input_db_name
DB_NAME=${input_db_name:-$DB_NAME}

read -p "Database user [$DB_USER]: " input_db_user
DB_USER=${input_db_user:-$DB_USER}

read -sp "Database password [$DB_PASSWORD]: " input_db_password
echo
DB_PASSWORD=${input_db_password:-$DB_PASSWORD}

# Create database and user
echo "Creating database and user..."

# Connect to PostgreSQL as superuser and create database/user
psql -U postgres <<EOF
-- Create user if not exists
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = '$DB_USER') THEN
        CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
    END IF;
END
\$\$;

-- Create database if not exists
SELECT 'CREATE DATABASE $DB_NAME'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
\c $DB_NAME
GRANT ALL ON SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database setup completed successfully!"
    echo ""
    echo "Update your .env file with:"
    echo "DATABASE_URL=\"postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME?schema=public\""
    echo ""
else
    echo "❌ Error setting up database. Please check your PostgreSQL installation and permissions."
    exit 1
fi

