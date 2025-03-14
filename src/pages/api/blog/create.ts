import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase/client';
import slugify from 'slugify';
import type { BlogPost } from '../../../services/BlogService';

export const post: APIRoute = async ({ request }) => {
  try {
    // Get the user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Authentication required',
          error: sessionError.message
        }),
        { status: 401 }
      );
    }

    if (!session) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Authentication required'
        }),
        { status: 401 }
      );
    }

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'User not found',
          error: userError?.message
        }),
        { status: 401 }
      );
    }

    // Parse the request body
    const blogData = await request.json();
    
    // Validate required fields
    if (!blogData.title || !blogData.content) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Title and content are required'
        }),
        { status: 400 }
      );
    }

    // Generate slug if not provided
    if (!blogData.slug) {
      const titleText = typeof blogData.title === 'object' ? 
        blogData.title.en || Object.values(blogData.title)[0] : 
        blogData.title;
      
      blogData.slug = slugify(titleText, {
        lower: true,
        strict: true
      });
    }

    // Check if slug already exists
    const { data: existingPost, error: slugCheckError } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('slug', blogData.slug)
      .maybeSingle();

    if (slugCheckError) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Error checking slug uniqueness',
          error: slugCheckError.message
        }),
        { status: 500 }
      );
    }

    if (existingPost) {
      // Append a random suffix to make slug unique
      blogData.slug = `${blogData.slug}-${Math.floor(Math.random() * 1000)}`;
    }

    // Prepare blog post data
    const newBlogPost: BlogPost = {
      slug: blogData.slug,
      title: blogData.title,
      content: blogData.content,
      excerpt: blogData.excerpt,
      featured_image: blogData.featured_image,
      category: blogData.category || 'Uncategorized',
      tags: Array.isArray(blogData.tags) ? blogData.tags : [],
      status: blogData.status || 'draft',
      author_id: user.id,
      published_at: blogData.status === 'published' ? new Date().toISOString() : undefined,
    };

    // Insert the blog post
    const { data: insertedPost, error: insertError } = await supabase
      .from('blog_posts')
      .insert([newBlogPost])
      .select()
      .single();

    if (insertError) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Error creating blog post',
          error: insertError.message
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Blog post created successfully',
        data: insertedPost
      }),
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to create blog post',
        error: errorMessage
      }),
      { status: 500 }
    );
  }
}; 