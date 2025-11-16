-- Simple PostgreSQL Setup Script
-- Run this as PostgreSQL superuser (usually 'postgres')
-- Usage: psql -U postgres -f setup-database-simple.sql

-- Create database
CREATE DATABASE ecommerce_db;

-- Create user
CREATE USER ecommerce_user WITH PASSWORD 'ecommerce_password_2024';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE ecommerce_db TO ecommerce_user;

-- Connect to the database and set up schema permissions
\c ecommerce_db

GRANT ALL ON SCHEMA public TO ecommerce_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ecommerce_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ecommerce_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ecommerce_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ecommerce_user;

