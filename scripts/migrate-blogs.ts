/**
 * Blog Migration Script
 * 
 * This script migrates blog posts from MDX files to Supabase.
 * It reads blog content from /src/content/blog and uploads it to the Supabase database.
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import matter from 'gray-matter';
import slugify from 'slugify';

// Config
const BLOG_DIR = path.resolve(process.cwd(), 'src/content/blog');
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Initialize Supabase client with admin privileges
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables must be set');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Types
interface BlogPost {
  slug: string;
  title: Record<string, string>;  // For multilingual support
  content: string;
  excerpt?: Record<string, string>;
  featured_image?: string;
  author_id?: string;
  category?: string;
  tags?: string[];
  status: 'draft' | 'published' | 'archived';
  published_at?: Date;
  created_at?: Date;
}

/**
 * Extracts title and excerpt in multiple languages from the content
 */
function extractMultilingualContent(content: string): { 
  title: Record<string, string>; 
  excerpt?: Record<string, string>;
  processedContent: string;
} {
  const titlePattern = /<h1\s+class="(.*?)">(.*?)<\/h1>/gs;
  const excerptPattern = /<p\s+class="excerpt\s+(.*?)">(.*?)<\/p>/gs;
  
  const title: Record<string, string> = {};
  const excerpt: Record<string, string> = {};
  let processedContent = content;

  // Extract titles
  let titleMatch;
  while ((titleMatch = titlePattern.exec(content)) !== null) {
    const lang = titleMatch[1].includes('en') ? 'en' : titleMatch[1].includes('ko') ? 'ko' : 'en';
    title[lang] = titleMatch[2].trim();
    
    // Remove the title from content
    processedContent = processedContent.replace(titleMatch[0], '');
  }

  // Extract excerpts
  let excerptMatch;
  while ((excerptMatch = excerptPattern.exec(content)) !== null) {
    const lang = excerptMatch[1].includes('en') ? 'en' : excerptMatch[1].includes('ko') ? 'ko' : 'en';
    excerpt[lang] = excerptMatch[2].trim();
    
    // Remove the excerpt from content
    processedContent = processedContent.replace(excerptMatch[0], '');
  }

  return { title, excerpt, processedContent };
}

/**
 * Process a single blog file
 */
async function processBlogFile(filePath: string): Promise<BlogPost | null> {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { data, content: mdxContent } = matter(content);
    
    // Get the filename without extension to use as a fallback slug
    const filename = path.basename(filePath, path.extname(filePath));
    
    // Extract multilingual content from markdown if available
    // If not, use frontmatter data
    const { title: extractedTitle, excerpt: extractedExcerpt, processedContent } = 
      extractMultilingualContent(mdxContent);
    
    // Determine title - prefer extracted multilingual, fallback to frontmatter
    const title = Object.keys(extractedTitle).length > 0 
      ? extractedTitle 
      : { en: data.title || filename };
    
    // Use frontmatter data or defaults
    const blogPost: BlogPost = {
      slug: data.slug || slugify(filename, { lower: true }),
      title,
      content: processedContent || mdxContent,
      excerpt: Object.keys(extractedExcerpt || {}).length > 0 ? extractedExcerpt : undefined,
      featured_image: data.image?.src || data.featuredImage || data.featured_image,
      // Don't set author_id if it's not a valid UUID
      // author_id: data.author || data.authorId || data.author_id,
      category: data.category || 'Uncategorized',
      tags: Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : [],
      status: data.draft ? 'draft' : 'published',
      published_at: data.date ? new Date(data.date) : new Date(),
    };

    return blogPost;
  } catch (error) {
    console.error(`Error processing blog file ${filePath}:`, error);
    return null;
  }
}

/**
 * Upload a blog post to Supabase
 */
async function uploadBlogPost(post: BlogPost): Promise<void> {
  try {
    // Check if post with this slug already exists
    const { data: existingPost, error: checkError } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', post.slug)
      .maybeSingle();

    if (checkError) {
      throw checkError;
    }

    if (existingPost) {
      // Update existing post
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          featured_image: post.featured_image,
          category: post.category,
          tags: post.tags,
          status: post.status,
          published_at: post.published_at,
          updated_at: new Date(),
        })
        .eq('slug', post.slug);

      if (updateError) {
        throw updateError;
      }
      
      console.log(`Updated blog post: ${post.slug}`);
    } else {
      // Insert new post
      const { error: insertError } = await supabase
        .from('blog_posts')
        .insert([post]);

      if (insertError) {
        throw insertError;
      }
      
      console.log(`Inserted blog post: ${post.slug}`);
    }
  } catch (error) {
    console.error(`Error uploading blog post ${post.slug}:`, error);
  }
}

/**
 * Main migration function
 */
async function migrateBlogPosts(): Promise<void> {
  try {
    console.log('Starting blog migration...');
    
    // Check if the blog directory exists
    if (!fs.existsSync(BLOG_DIR)) {
      console.error(`Blog directory not found: ${BLOG_DIR}`);
      return;
    }

    // Get all MDX files
    const files = fs.readdirSync(BLOG_DIR)
      .filter(file => file.endsWith('.mdx') || file.endsWith('.md'));
    
    console.log(`Found ${files.length} blog posts to migrate`);

    // Process each file
    for (const file of files) {
      const filePath = path.join(BLOG_DIR, file);
      const blogPost = await processBlogFile(filePath);
      
      if (blogPost) {
        await uploadBlogPost(blogPost);
      }
    }

    console.log('Blog migration completed successfully');
  } catch (error) {
    console.error('Error during blog migration:', error);
    process.exit(1);
  }
}

// Run migration
migrateBlogPosts();