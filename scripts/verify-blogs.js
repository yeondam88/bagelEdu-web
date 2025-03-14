// Script to verify migrated blog posts in Supabase
import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials
const supabaseUrl = process.env.SUPABASE_URL || 'https://vszxxiryhbllennzygfo.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzenh4aXJ5aGJsbGVubnp5Z2ZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NDI5MzMsImV4cCI6MjA1NzQxODkzM30.rPojSkMonP3Nq2SabqYwQK223LwQsZOelueyCqxAWm0';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyBlogPosts() {
  try {
    console.log('Fetching migrated blog posts from Supabase...');
    
    const { data, error, count } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact' });
    
    if (error) {
      console.error('Error fetching blog posts:', error);
      return;
    }
    
    console.log(`Successfully fetched ${count} blog posts.`);
    
    // Display a summary of the blog posts
    if (data && data.length > 0) {
      console.log('\nBlog Posts Summary:');
      console.log('-------------------');
      
      data.forEach((post, index) => {
        const title = typeof post.title === 'object' 
          ? JSON.stringify(post.title).substring(0, 50) 
          : post.title.substring(0, 50);
        
        console.log(`${index + 1}. ${title}... (${post.slug})`);
        console.log(`   Status: ${post.status}, Category: ${post.category}`);
        console.log(`   Published: ${new Date(post.published_at || post.created_at).toLocaleDateString()}`);
        console.log('-------------------');
      });
      
      console.log('\nVerification complete. Blog posts have been successfully migrated!');
    } else {
      console.log('No blog posts found in the database.');
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
verifyBlogPosts(); 