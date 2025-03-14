import React, { useState, useRef, useEffect } from 'react';

export default function UserDropdown({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const dropdownRef = useRef(null);

  // Handle logout via server endpoint
  const handleLogout = async () => {
    // Call the server-side signout endpoint using a form
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/api/auth/signout';
    document.body.appendChild(form);
    form.submit();
  };

  // Reset image error state when user changes
  useEffect(() => {
    setImageError(false);
  }, [user?.user_metadata?.avatar_url]);

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // If no user is provided, show a placeholder
  if (!user) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="w-8 h-8 rounded-full bg-gray-200"></div>
        <div>Loading user...</div>
      </div>
    );
  }
  
  // Check if avatar_url exists and image hasn't errored
  const hasValidAvatar = user.user_metadata?.avatar_url && !imageError;

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm w-full"
      >
        {hasValidAvatar ? (
          <img
            src={user.user_metadata.avatar_url}
            alt={user.user_metadata?.full_name || user.email}
            className="w-8 h-8 rounded-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
            {(user.user_metadata?.full_name || user.email || 'User').charAt(0).toUpperCase()}
          </div>
        )}
        <div className="text-left">
          <p className="font-medium text-foreground">
            {user.user_metadata?.full_name || 'User'}
          </p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-lg border border-border z-10">
          <a
            href="/admin/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-accent hover:text-accent-foreground"
          >
            Your Profile
          </a>
          <a
            href="/admin/settings"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-accent hover:text-accent-foreground"
          >
            Settings
          </a>
          <div className="border-t border-border my-1"></div>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
} 