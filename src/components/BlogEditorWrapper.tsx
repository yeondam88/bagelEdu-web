import React from 'react';
import { BlogEditor } from './admin/BlogEditor';
import type { BlogPost } from '../services/BlogService';

interface BlogEditorWrapperProps {
  blogPost?: BlogPost;
}

// Named export that can be used with client:only directive
export function BlogEditorWrapper({ blogPost }: BlogEditorWrapperProps) {
  return <BlogEditor post={blogPost} />;
}

// Provide a default export for flexibility
export default BlogEditorWrapper; 