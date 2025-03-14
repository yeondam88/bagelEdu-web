# Blog Migration Guide

This guide explains how to migrate your file-based blog content to Supabase.

## Overview

The BagelEdu website previously used file-based content (Markdown and MDX files) for blog posts. To improve content management through an admin dashboard, we've migrated to a database-backed solution using Supabase.

This migration process:

1. Creates a proper database schema in Supabase for blog posts
2. Transfers existing file-based content to the database
3. Updates the admin dashboard to manage posts in Supabase
4. Maintains support for multilingual content (English and Korean)

## Migration Steps

### 1. Set up Environment Variables

Make sure you have the following environment variables set in your `.env` file:

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

The `SUPABASE_SERVICE_ROLE_KEY` is required for the migration script to have admin access to the database.

### 2. Run the Migration Setup Script

```bash
./scripts/setup-blog-migration.sh
```

This script will:
- Install required dependencies
- Guide you through applying the database schema to Supabase
- Run the migration script to transfer content from files to the database

### 3. Manual Steps

1. Apply the schema in `scripts/blog_schema.sql` to your Supabase project using the SQL Editor.
2. Run the migration script: `npm run migrate:blogs`

### 4. Check and Verify

After migration:

1. Log in to the admin dashboard
2. Navigate to the Blog section
3. Verify that all posts have been correctly migrated
4. Update any metadata or additional fields as needed

## Schema Details

The `blog_posts` table includes:

- `id` - UUID primary key
- `title` - Text (can be plain text or JSON for multilingual content)
- `slug` - URL-friendly identifier (unique)
- `content` - The main content in Markdown/HTML
- `excerpt` - A summary (can be multilingual)
- `featured_image` - URL to the featured image
- `author_id` - UUID reference to auth.users
- `category` - Text category
- `tags` - Text array of tags
- `status` - Text ('draft', 'published', 'archived')
- `published_at` - Timestamp when published
- `created_at` - Timestamp of creation
- `updated_at` - Timestamp of last update

## Multilingual Content

The migration process preserves multilingual content by:

1. Storing multilingual fields like `title` and `excerpt` as JSON strings in the database
2. Parsing these fields when retrieving posts
3. Displaying the appropriate language based on user preference

## Troubleshooting

If you encounter issues during migration:

1. Check the console output for specific error messages
2. Verify your Supabase credentials and permissions
3. Ensure the SQL schema has been correctly applied
4. Check if your Markdown files follow the expected frontmatter format
5. Make sure the content directory structure is correct

For further assistance, contact the development team.

## Future Enhancements

Planned improvements:

1. Enhanced rich text editor with image upload
2. Categories and tags management
3. Scheduled publishing
4. Advanced filtering and search
5. Analytics integration

## Contributing

If you'd like to contribute to the blog system:

1. Understand the current architecture
2. Test your changes thoroughly
3. Maintain support for multilingual content
4. Document your changes

## License

Same as the main project. 