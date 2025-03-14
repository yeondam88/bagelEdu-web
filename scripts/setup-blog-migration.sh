#!/bin/bash

# Setup Blog Migration Script
# This script applies the blog schema to Supabase and runs the migration

echo "Setting up blog migration..."

# Check if environment variables are set
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set"
  echo "Please set them in your environment or .env file"
  exit 1
fi

# Install required dependencies
echo "Installing required dependencies..."
npm install --save-dev tsx gray-matter slugify

# Apply database schema
echo "Applying database schema to Supabase..."
# Note: In a real scenario, you would use supabase CLI or direct database connection
# For demo purposes, we're assuming the user will manually run the SQL

echo "To apply the schema manually, please run the SQL in scripts/blog_schema.sql in your Supabase SQL editor"
echo "Press Enter to continue after applying the schema..."
read -r

# Run the migration script
echo "Running blog migration script..."
npm run migrate:blogs

echo "Migration setup complete!"
echo "You can now manage blog posts from the admin dashboard." 