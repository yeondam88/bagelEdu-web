// A simple script to check the Supabase connection and create the blog_posts table
const { createClient } = require('@supabase/supabase-js');

// Get Supabase credentials from environment or specify them here
const supabaseUrl = process.env.SUPABASE_URL || 'https://vszxxiryhbllennzygfo.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzenh4aXJ5aGJsbGVubnp5Z2ZvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTg0MjkzMywiZXhwIjoyMDU3NDE4OTMzfQ.3FdS2zgZyYpVr3QTms64veD7RellYTf3btRyssq3pIc';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkConnection() {
  try {
    console.log('Checking connection to Supabase...');
    
    // Try to query something simple
    const { data, error } = await supabase.from('blog_posts').select('*').limit(1);
    
    if (error && error.code === '42P01') { // Table doesn't exist error
      console.log('The blog_posts table does not exist. Creating it now...');
      
      // Create the table
      const { error: createError } = await supabase.rpc('create_blog_posts_table');
      
      if (createError) {
        console.error('Error creating table:', createError);
        console.log('You need to run the SQL script manually in the Supabase SQL Editor.');
        return;
      }
      
      console.log('Table created successfully!');
    } else if (error) {
      console.error('Error connecting to Supabase:', error);
    } else {
      console.log('Connection successful! Found blog_posts table with data:', data);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
checkConnection(); 