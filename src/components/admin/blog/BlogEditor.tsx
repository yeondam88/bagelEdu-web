/*
This file is a reference to the BlogEditor component that exists at src/components/admin/BlogEditor.tsx.
It's here to maintain compatibility with imports expecting the BlogEditor to be in this location.

The actual component code is in:
src/components/admin/BlogEditor.tsx
*/

import React from 'react';
import { BlogEditor as OriginalBlogEditor } from '../BlogEditor';
import type { BlogPost } from '../../../services/BlogService';

// Use the same prop names as the original component
interface BlogEditorProps {
  blogPost?: BlogPost;
}

// Create a dedicated React component that wraps the original BlogEditor
const BlogEditorWrapper: React.FC<BlogEditorProps> = ({ blogPost }) => {
  // The original component uses 'post' instead of 'blogPost'
  return <OriginalBlogEditor post={blogPost} />;
};

// Export the BlogEditor component as a default export for Astro's client:only directive
export default BlogEditorWrapper; 