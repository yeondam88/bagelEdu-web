import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase/client';

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  // Get the code and state params from the URL
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  
  if (code) {
    // The PKCE flow will automatically exchange the code for a session
    // This happens internally in the Supabase client
    await supabase.auth.exchangeCodeForSession(code);
    
    console.log('Successfully exchanged code for session');
  } else {
    console.error('No code parameter found in callback URL');
  }
  
  // After authenticating, user will be redirected to the admin dashboard
  return redirect('/admin');
}; 