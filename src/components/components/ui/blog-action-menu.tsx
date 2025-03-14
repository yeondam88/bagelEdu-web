import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { Button } from './button';

// Import the BlogPost type or define a minimal interface
interface BlogPost {
  id: string;
  title: string | Record<string, string>;
  [key: string]: any;
}

interface BlogActionMenuProps {
  post: BlogPost;
}

export function BlogActionMenu({ post }: BlogActionMenuProps) {
  // Add state for loading status
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Helper to get display title
  const getDisplayTitle = (title: string | Record<string, string>): string => {
    if (typeof title === 'string') {
      return title;
    }
    // Return English title or first available language
    return title.en || Object.values(title)[0] || 'Untitled';
  };

  // Handle edit action
  const handleEdit = () => {
    window.location.href = `/admin/content/blog/edit/${post.id}`;
  };

  // Handle preview action
  const handlePreview = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(`/blog/preview/${post.id}`, '_blank');
  };

  // Handle delete action
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    const postTitle = getDisplayTitle(post.title);
    
    if (confirm(`Are you sure you want to delete "${postTitle}"? This action cannot be undone.`)) {
      try {
        setIsDeleting(true);
        
        // Call API to delete post
        const response = await fetch(`/api/blog/delete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: post.id }),
        });
        
        const result = await response.json();
        
        if (response.ok) {
          // Find the row and remove it - we'll use a DOM method since we're outside React's control
          const row = document.querySelector(`tr[data-post-id="${post.id}"]`);
          if (row) {
            row.setAttribute('style', 'background-color: #FFEDED');
            setTimeout(() => {
              row.remove();
              alert('Post deleted successfully');
            }, 500);
          }
        } else {
          throw new Error(result.message || 'Failed to delete post');
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('An error occurred while deleting the post. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-end space-x-2">
      {/* Edit button - Always visible on desktop */}
      <Button
        variant="ghost"
        size="sm"
        className="hidden sm:flex items-center edit-btn"
        onClick={handleEdit}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
        Edit
      </Button>

      {/* Preview button - Always visible on desktop */}
      <Button
        variant="ghost"
        size="sm"
        className="hidden sm:flex items-center preview-btn"
        onClick={handlePreview}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
        Preview
      </Button>

      {/* All actions dropdown - Visible on all screens */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <span className="sr-only">Open menu</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="12" cy="5" r="1"></circle>
              <circle cx="12" cy="19" r="1"></circle>
            </svg>
            <span className="sm:hidden">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Post Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="sm:hidden">
            <button
              className="w-full flex items-center edit-btn"
              onClick={handleEdit}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Edit
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <button 
              className="preview-btn w-full text-left flex items-center"
              onClick={handlePreview}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              Preview
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem disabled={isDeleting}>
            <button 
              className="delete-btn text-red-600 w-full text-left flex items-center"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <svg className="animate-spin mr-2 delete-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  <span className="delete-text">Deleting...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 delete-icon">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  <span className="delete-text">Delete</span>
                </>
              )}
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 