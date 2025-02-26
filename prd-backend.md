# Backend Implementation Plan for Astro Content Management System

## 1. Architecture Overview

### Current Structure

- Astro-based frontend
- Content currently managed through file-based content collections
- Limited API functionality (contact form only)

### Proposed Architecture

- **Frontend**: Continue using Astro for the frontend
- **Backend**:
  - Implement API routes in Astro using API endpoints
  - Use serverless functions for authentication and content management
  - Maintain file-based content collections (no separate database)
  - Utilize DigitalOcean Spaces for media files

## 2. Technology Stack

### Core Technologies

- **Astro**: Continue as the main framework
- **Authentication**: Auth.js with Google provider integration
- **Content Storage**: File-based content collections (MDX files)
- **Media Storage**: DigitalOcean Spaces for images and media

### Required Packages

```bash
# Authentication
npm install @auth/core @auth/astro @auth/google

# File System Operations
npm install fs-extra gray-matter

# Utilities
npm install zod slugify

# DigitalOcean Storage
npm install @digitalocean/spaces-js aws-sdk
```

## 3. Backend Features Implementation

### 3.1 Authentication System

1. **Setup Auth.js with Google Sign-In**

   - Configure Google OAuth provider
   - Implement session management with cookies
   - Store minimal user data in JSON files
   - Setup login and logout endpoints

2. **Role-Based Access Control**

   - Admin role management via a config file
   - Basic role checking for protected routes

3. **Authentication Middleware**
   - Create middleware to protect API routes and admin pages
   - Session verification for API requests

### 3.2 Content Management System

1. **Blog Post Management**

   - Create admin pages for adding/editing blog posts
   - MDX content editing with preview
   - Generate and manage frontmatter metadata
   - Write changes directly to content collection files

2. **Media Upload to DigitalOcean**
   - Image upload to DigitalOcean Spaces
   - Image optimization before upload
   - Generate URLs for embedding in content
   - Media browser to select existing images

### 3.3 Admin Dashboard

1. **Admin UI**

   - Protected admin section (requires Google login)
   - Dashboard with content statistics
   - Content editor with Markdown support
   - Integrated media browser

2. **Content Editor Features**
   - Rich text editing for MDX
   - Metadata form for frontmatter
   - Image embedding from DigitalOcean
   - Content preview before publishing

## 4. Implementation Details

### User Authentication

```typescript
// Simple user record (stored in JSON)
interface User {
  id: string
  email: string
  name: string
  picture: string
  role: 'admin' | 'editor'
  lastLogin: string
}

// Config file for authorized users
const authorizedUsers = ['admin@example.com', 'editor@example.com']
```

### Content File Structure

```typescript
// Blog Post frontmatter structure (in MDX)
interface BlogPostFrontmatter {
  title: string
  slug: string
  excerpt: string
  featuredImage: string // URL to DigitalOcean
  author: string
  categories: string[]
  tags: string[]
  status: 'draft' | 'published'
  publishedAt: string // ISO date
  createdAt: string // ISO date
  updatedAt: string // ISO date
}
```

### DigitalOcean API Integration

```typescript
// Basic integration with DigitalOcean Spaces
async function uploadToDigitalOcean(file, path) {
  const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT)
  const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  })

  const params = {
    Bucket: process.env.DO_SPACES_NAME,
    Key: path,
    Body: file.buffer,
    ACL: 'public-read',
    ContentType: file.mimetype,
  }

  const result = await s3.upload(params).promise()
  return result.Location
}
```

## 5. Implementation Phases

### Phase 1: Authentication Setup (1 week)

- Configure Auth.js with Google provider
- Set up protected routes for admin
- Create admin-only API endpoints
- Implement basic user management

### Phase 2: DigitalOcean Integration (1 week)

- Set up DigitalOcean Spaces connection
- Create image upload API
- Implement image optimization
- Build media browser component

### Phase 3: Blog Post Management (2 weeks)

- Create blog post editor UI
- Implement frontmatter management
- Develop file system read/write operations
- Set up content preview functionality

### Phase 4: Admin Dashboard (1-2 weeks)

- Build comprehensive admin interface
- Create content listing and filtering
- Add basic analytics for content
- Implement user-friendly editing experience

## 6. File-Based Content Workflow

1. **Content Creation Flow**

   - Admin logs in via Google Sign-In
   - Creates/edits blog post in admin UI
   - Uploads images to DigitalOcean Spaces
   - Post saved as MDX file in content collection
   - Content rendered from files on the frontend

2. **Deployment Integration**
   - Content changes trigger repository updates
   - Automatic deployment via existing CI/CD pipeline
   - No database migration needed

## 7. Implementation Example: Blog Post Editor

```typescript
// API route for saving blog posts (src/pages/api/blog/save.ts)
export async function post({ request }) {
  // Verify authentication
  const session = await getSession(request)
  if (!session || !isAuthorized(session.user.email)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    })
  }

  const data = await request.json()
  const { title, content, ...metadata } = data

  // Generate slug from title if not provided
  const slug = metadata.slug || slugify(title)

  // Create frontmatter
  const frontmatter = {
    title,
    slug,
    ...metadata,
    updatedAt: new Date().toISOString(),
    createdAt: metadata.createdAt || new Date().toISOString(),
  }

  // Format as MDX with frontmatter
  const fileContent = `---\n${yaml.stringify(frontmatter)}---\n\n${content}`

  // Save to content collection
  const filePath = `src/content/blog/${slug}.mdx`
  await fs.writeFile(filePath, fileContent, 'utf-8')

  return new Response(JSON.stringify({ success: true, slug }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
```

## 8. DigitalOcean Spaces Integration Example

```typescript
// API route for uploading images (src/pages/api/upload.ts)
export async function post({ request }) {
  // Verify authentication
  const session = await getSession(request)
  if (!session || !isAuthorized(session.user.email)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    })
  }

  const formData = await request.formData()
  const file = formData.get('file')
  const contentType = formData.get('contentType') || 'general'

  if (!file) {
    return new Response(JSON.stringify({ error: 'No file uploaded' }), {
      status: 400,
    })
  }

  // Process file (optimize if image)
  const processedFile = await optimizeImage(file)

  // Generate path in DigitalOcean
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
  const path = `${contentType}/${fileName}`

  // Upload to DigitalOcean Spaces
  const url = await uploadToDigitalOcean(processedFile, path)

  return new Response(
    JSON.stringify({
      success: true,
      url,
      filename: fileName,
      path,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    },
  )
}
``` 

## Next Steps

1. Set up Google Sign-In authentication
2. Create DigitalOcean Spaces integration for image uploads
3. Build blog post editor admin page
4. Implement file-based content management system

This simplified approach focuses on using Google authentication, file-based content management, and DigitalOcean Spaces for media without requiring a separate database. We can start by implementing the authentication and image upload functionality for blog posts.



# Git-Based Content Management Workflow

## How Admin UI Changes Commit to the Repository

When you add or edit content via an admin UI, committing those changes to a Git repository involves several interconnected steps. Here's how the entire process works:



┌──────────────┐      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│              │      │              │      │              │      │              │      │              │
│   Admin UI   │─────▶│  API Server  │─────▶│  Git Commit  │─────▶│   Push to    │─────▶│   Trigger    │
│  Interface   │      │   Endpoint   │      │   Changes    │      │  Repository  │      │   Rebuild    │
│              │      │              │      │              │      │              │      │              │
└──────────────┘      └──────────────┘      └──────────────┘      └──────────────┘      └──────────────┘



# Git-Based Content Management with Vercel GitHub Integration

## Leveraging Vercel GitHub Integration

Yes, you can absolutely use Vercel's GitHub integration with this workflow—in fact, it's ideal! Vercel's GitHub integration provides several advantages that simplify the content management process:

```
<code_block_to_apply_changes_from>
```

## How It Works with Vercel

1. **Admin creates/edits content** via your admin interface
2. **API endpoint commits changes** to your GitHub repository
3. **Vercel automatically detects changes** through GitHub integration
4. **Vercel rebuilds and deploys** the updated site

## Implementation Details

### 1. GitHub Authentication

With Vercel's GitHub integration, you'll need to authenticate your API to commit to GitHub:

```typescript
// src/lib/github.ts
import { Octokit } from '@octokit/rest';

export async function commitToGitHub(filePath, content, commitMessage) {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN // Create a Personal Access Token with repo scope
  });
  
  // Get current file SHA if it exists (needed for update)
  let fileSha;
  try {
    const { data } = await octokit.repos.getContent({
      owner: process.env.GITHUB_OWNER,
      repo: process.env.GITHUB_REPO,
      path: filePath,
      ref: process.env.GITHUB_BRANCH || 'main'
    });
    fileSha = data.sha;
  } catch (error) {
    // File doesn't exist yet, which is fine for new content
  }
  
  // Commit the file
  await octokit.repos.createOrUpdateFileContents({
    owner: process.env.GITHUB_OWNER,
    repo: process.env.GITHUB_REPO,
    path: filePath,
    message: commitMessage,
    content: Buffer.from(content).toString('base64'),
    sha: fileSha,
    branch: process.env.GITHUB_BRANCH || 'main'
  });
}
```

### 2. API Endpoint Integration

Your blog post save endpoint would use this GitHub function:

```typescript
// src/pages/api/blog/save.ts
import { commitToGitHub } from '../../lib/github';
import matter from 'gray-matter';
import { slugify } from '../../utils/slugify';

export async function post({ request }) {
  // Authentication check
  const session = await getSession(request);
  if (!session || !isAuthorized(session.user.email)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  
  const data = await request.json();
  const { title, content, ...metadata } = data;
  
  // Generate slug if not provided
  const slug = metadata.slug || slugify(title);
  
  // Create frontmatter
  const frontmatter = {
    title,
    slug,
    ...metadata,
    updatedAt: new Date().toISOString(),
    createdAt: metadata.createdAt || new Date().toISOString()
  };
  
  // Format MDX content
  const yamlString = matter.stringify('', frontmatter).trim();
  const fileContent = `---\n${yamlString.slice(4, -3)}\n---\n\n${content}`;
  
  // Define file path in the repository
  const filePath = `src/content/blog/${slug}.mdx`;
  
  try {
    // Commit to GitHub
    await commitToGitHub(
      filePath,
      fileContent,
      `${metadata.id ? 'Update' : 'Add'} blog post: ${title}`
    );
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Content saved to GitHub',
      slug
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('GitHub commit error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to save content',
      details: error.message
    }), { status: 500 });
  }
}
```

## Advantages of Vercel + GitHub Integration

1. **Automatic Deployment**: No need to manually trigger rebuilds
2. **Preview Deployments**: Get preview URLs for content changes
3. **Deployment History**: Track which content changes triggered which builds
4. **Rollbacks**: Easily revert to previous versions via Vercel dashboard
5. **Branch Previews**: Test content changes on branches before merging to production

## Environment Variables

You'll need to set these environment variables in your Vercel project:

```
GITHUB_TOKEN=your_personal_access_token
GITHUB_OWNER=your_username_or_org
GITHUB_REPO=your_repository_name
GITHUB_BRANCH=main
```

## Practical Implementation Tips

1. **Use GitHub Apps instead of personal tokens** for better security in production
2. **Set up branch protection rules** in GitHub to prevent accidental direct pushes
3. **Consider implementing content workflows** with draft branches for review before publishing
4. **Use Vercel's preview deployments** to preview content changes before merging

## Benefits for Your Workflow

This approach gives you:
- The simplicity of file-based content
- The power of version control
- The convenience of an admin UI
- The reliability of automated deployments

Additionally, Vercel's tight GitHub integration ensures your content changes are immediately detected and deployed with no extra configuration needed.


