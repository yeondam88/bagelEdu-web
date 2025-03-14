// Script to create blog schema in Supabase
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get Supabase credentials
const supabaseUrl = process.env.SUPABASE_URL || 'https://vszxxiryhbllennzygfo.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzenh4aXJ5aGJsbGVubnp5Z2ZvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTg0MjkzMywiZXhwIjoyMDU3NDE4OTMzfQ.3FdS2zgZyYpVr3QTms64veD7RellYTf3btRyssq3pIc';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createSchema() {
  try {
    console.log('Creating blog posts schema in Supabase...');
    
    // Read SQL file
    const sqlFilePath = path.join(__dirname, 'blog_schema.sql');
    let sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Remove any trailing % character that might be there
    sqlContent = sqlContent.replace(/%\s*$/, '');
    
    // Execute the SQL directly
    const { error } = await supabase.rpc('pg_query', { query_text: sqlContent });
    
    if (error) {
      console.error('Error creating schema:', error);
      
      // Try an alternative approach if the first one failed
      console.log('Trying alternative approach with individual queries...');
      
      // First create the extension
      console.log('Creating uuid-ossp extension...');
      await supabase.rpc('pg_query', { query_text: 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";' });
      
      // Then create the table
      console.log('Creating blog_posts table...');
      await supabase.rpc('pg_query', { 
        query_text: `
          CREATE TABLE IF NOT EXISTS public.blog_posts (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            slug TEXT UNIQUE NOT NULL,
            title JSONB NOT NULL,
            content TEXT NOT NULL,
            excerpt JSONB,
            featured_image TEXT,
            author_id UUID REFERENCES auth.users(id),
            category TEXT,
            tags TEXT[] DEFAULT '{}',
            status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
            published_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
          );
        `
      });
      
      // Create indices and RLS policies
      console.log('Setting up indices and RLS policies...');
      const setupQueries = [
        `CREATE POLICY "Anyone can read published blog posts" ON public.blog_posts FOR SELECT USING (status = 'published');`,
        `CREATE POLICY "Authenticated users can insert blog posts" ON public.blog_posts FOR INSERT TO authenticated WITH CHECK (true);`,
        `CREATE POLICY "Only author or admin can update blog posts" ON public.blog_posts FOR UPDATE TO authenticated USING (author_id = auth.uid() OR EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin')) WITH CHECK (author_id = auth.uid() OR EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'));`,
        `CREATE POLICY "Only author or admin can delete blog posts" ON public.blog_posts FOR DELETE TO authenticated USING (author_id = auth.uid() OR EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'));`,
        `CREATE INDEX blog_posts_slug_idx ON public.blog_posts (slug);`,
        `CREATE INDEX blog_posts_status_idx ON public.blog_posts (status);`,
        `CREATE INDEX blog_posts_author_id_idx ON public.blog_posts (author_id);`,
        `CREATE INDEX blog_posts_published_at_idx ON public.blog_posts (published_at);`,
        `ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;`
      ];
      
      for (const query of setupQueries) {
        const { error } = await supabase.rpc('pg_query', { query_text: query });
        if (error) {
          console.log(`Warning: Error executing query: ${query}`);
          console.log(`Error: ${error.message}`);
        }
      }
      
      // Create updated_at trigger
      console.log('Setting up updated_at trigger...');
      await supabase.rpc('pg_query', { 
        query_text: `
          CREATE OR REPLACE FUNCTION update_modified_column()
          RETURNS TRIGGER AS $$
          BEGIN
              NEW.updated_at = now();
              RETURN NEW;
          END;
          $$ LANGUAGE plpgsql;
        `
      });
      
      await supabase.rpc('pg_query', { 
        query_text: `
          CREATE TRIGGER update_blog_posts_modtime
          BEFORE UPDATE ON public.blog_posts
          FOR EACH ROW
          EXECUTE FUNCTION update_modified_column();
        `
      });
      
      console.log('Schema setup complete with alternative approach.');
    } else {
      console.log('Schema created successfully!');
    }
    
    // Verify the table was created
    const { data, error: verifyError } = await supabase
      .from('blog_posts')
      .select('*')
      .limit(1);
      
    if (verifyError) {
      console.error('Error verifying table creation:', verifyError);
    } else {
      console.log('Table verification successful!');
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
createSchema(); 