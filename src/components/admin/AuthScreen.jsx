import React, { useState } from 'react';
import { supabase } from '../../lib/supabase/client';

/**
 * Authentication screen component for Bagel Admin
 * Uses server-side authentication endpoints
 */
export default function AuthScreen() {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState(null);

  // Sign in with Google through server endpoint
  const signInWithGoogle = async () => {
    try {
      setIsSigningIn(true);
      setError(null);
      
      // Use form submission to the server endpoint
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = '/api/auth/signin';
      
      // Add provider input
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'provider';
      input.value = 'google';
      form.appendChild(input);
      
      // Submit the form
      document.body.appendChild(form);
      form.submit();
      
      // The form submission will navigate away, but set loading state in case there's a delay
    } catch (err) {
      console.error('Error initiating sign-in:', err);
      setError('An error occurred while initiating sign-in. Please try again.');
      setIsSigningIn(false);
    }
  };

  // Render clean auth screen without manual session checks
  return (
    <div className="auth-screen min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Authentication Required</h2>
          <p className="text-gray-600 mb-8">Please sign in to access the admin dashboard</p>
          
          <button
            onClick={signInWithGoogle}
            disabled={isSigningIn}
            className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSigningIn ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" fill="currentColor"/>
                </svg>
                Sign in with Google
              </>
            )}
          </button>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
              {error}
            </div>
          )}
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Having trouble signing in? Contact your administrator for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 