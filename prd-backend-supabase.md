# Backend Implementation Plan for Astro Content Management System with Supabase

## 1. Architecture Overview

### Current Structure

- Astro-based frontend
- Content currently managed through file-based content collections
- Limited API functionality (contact form only)

### Proposed Architecture

- **Frontend**: Continue using Astro for the frontend
- **Backend**:
  - Implement API routes in Astro using API endpoints
  - Use Supabase for authentication, database, and storage
  - Implement OpenAI integration for AI-assisted content creation
  - Create an admin UI for non-developer content management

## 2. Technology Stack

### Core Technologies

- **Astro**: Continue as the main framework
- **Database & Authentication**: Supabase (PostgreSQL + Auth)
- **Content Storage**: Supabase Database (replaces file-based collections)
- **Media Storage**: Supabase Storage (replaces DigitalOcean Spaces)
- **AI Integration**: OpenAI API
- **UI Components**: React (using existing Astro React integration)

### Required Packages

```bash
# Supabase
npm install @supabase/supabase-js

# OpenAI
npm install openai

# UI Tools for Admin Interface
npm install react-hook-form @tanstack/react-table react-hot-toast

# Utilities
npm install zod slugify date-fns
```

## 3. Backend Features Implementation

### 3.1 Supabase Setup

1. **Project Creation and Configuration**

   - Create a new Supabase project
   - Set up database tables for all content types
   - Configure Row Level Security (RLS) policies
   - Set up Storage buckets for media files

2. **Database Schema**

   ```sql
   -- Example schema for blog posts
   CREATE TABLE blog_posts (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     title JSONB NOT NULL, -- For localized strings {en: string, ko: string}
     slug TEXT UNIQUE NOT NULL,
     content TEXT NOT NULL,
     excerpt JSONB NOT NULL,
     featured_image TEXT,
     author UUID REFERENCES authors(id),
     category TEXT,
     tags TEXT[],
     status TEXT DEFAULT 'draft',
     published_at TIMESTAMP WITH TIME ZONE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Similar tables for other content types
   -- programs, testimonials, faqs, events, etc.
   ```

3. **Authentication Setup**

   - Configure Google OAuth provider in Supabase
   - Set up user roles and permissions
   - Create admin user management

### 3.2 API Endpoints Development

1. **Content Management API**

   - Create endpoints for CRUD operations on all content types
   - Implement filtering, pagination, and sorting
   - Set up validation using Zod schemas
   - Implement version history tracking

2. **Media Management API**

   - Create file upload endpoints for Supabase Storage
   - Implement image optimization and processing
   - Build media browser and selector functionality

3. **OpenAI Integration**

   - Create AI content generation endpoints
   - Implement content enhancement features
   - Build content summarization and SEO assistance

### 3.3 Admin Dashboard Development

1. **Admin UI Framework**

   - Create a protected admin section
   - Build responsive dashboard layout
   - Implement navigation and user management

2. **Content Editor**

   - Build rich text editor with Markdown support
   - Create form interfaces for all content types
   - Implement real-time preview functionality
   - Add AI-assisted writing features

3. **Media Manager**

   - Build media library browser
   - Create upload interface with drag-and-drop
   - Implement media search and filtering

## 4. Implementation Details

### Supabase Integration

```typescript
// Supabase client setup
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Example of fetching content
async function getBlogPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
  
  if (error) throw error
  return data
}

// Example of creating content
async function createBlogPost(post) {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert([post])
    .select()
  
  if (error) throw error
  return data[0]
}
```

### Authentication Flow

```typescript
// Sign in with Google
async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/admin/dashboard`
    }
  })
  
  if (error) throw error
  return data
}

// Check auth status
async function getUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Protected API route example
export async function GET({ request }) {
  // Get auth token from request
  const authHeader = request.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  // Verify with Supabase
  const token = authHeader.split(' ')[1]
  const { data: { user }, error } = await supabase.auth.getUser(token)
  
  if (error || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  // Continue with authorized request
  // ...
}
```

### OpenAI Integration

```typescript
// OpenAI client setup
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: import.meta.env.OPENAI_API_KEY })

// Generate content suggestions
async function generateContentSuggestions(prompt) {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 500
  })
  
  return response.choices[0].message.content
}

// AI-assisted editing API endpoint
export async function POST({ request }) {
  const { content, action } = await request.json()
  
  let prompt = ""
  switch (action) {
    case "improve":
      prompt = `Improve the following content without changing the meaning: ${content}`
      break
    case "summarize":
      prompt = `Summarize the following content in 2-3 sentences: ${content}`
      break
    case "seo":
      prompt = `Suggest 5 SEO improvements for the following content: ${content}`
      break
    default:
      return new Response(JSON.stringify({ error: "Invalid action" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
  }
  
  try {
    const suggestion = await generateContentSuggestions(prompt)
    return new Response(JSON.stringify({ suggestion }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
```

## 5. Implementation Phases

### Phase 1: Supabase Setup and Configuration (1 week)

- Create Supabase project
- Design and implement database schema
- Set up authentication
- Configure storage buckets
- Establish security policies

### Phase 2: API Development (2 weeks)

- Create core content API endpoints
- Implement authentication flow
- Build media upload functionality
- Develop OpenAI integration endpoints

### Phase 3: Admin UI Development (2-3 weeks)

- Build admin dashboard layout
- Create content editor interfaces
- Implement media browser
- Add AI-assisted content tools

### Phase 4: Migration and Testing (1-2 weeks)

- Migrate existing content to Supabase
- Test all functionality
- Optimize performance
- Documentation and training

## 6. User Workflow

1. **Content Creation Flow**

   - Admin logs in via Google authentication (through Supabase)
   - Creates/edits content in the admin UI
   - Optionally uses AI assistance for content creation
   - Uploads media to Supabase Storage
   - Publishes content (instantly available, no deployment needed)

2. **Content Retrieval Flow**

   - Astro frontend fetches content from Supabase
   - Server-side rendering for SEO benefits
   - Caching strategies for performance

3. **Development vs. Production**

   - Development environment connects to development Supabase instance
   - Production environment connects to production Supabase instance
   - CI/CD pipeline deploys code changes, but content changes don't require deployment

## 7. Benefits Over File-Based Approach

- **Instant publishing**: No deployment needed for content changes
- **Non-developer friendly**: Familiar CMS-like experience
- **Robust media management**: Integrated with content
- **Better for dynamic content**: Real-time updates
- **Enhanced collaboration**: Multiple editors can work simultaneously
- **AI integration**: Deeper AI features with database storage
- **Version history**: Track changes through database
- **Scalability**: Easier to scale as content grows

## 8. Considerations and Challenges

- **Data migration**: Need to migrate existing content collections to Supabase
- **Backup strategy**: Regular database backups needed
- **Costs**: Supabase has free tier but may incur costs as usage grows
- **Learning curve**: Team needs to learn Supabase concepts 