import React from 'react';
import { BlogEditor } from './admin/BlogEditor';

// Export as a named export
export function BlogEditorWrapper(props) {
  return <BlogEditor post={props.blogPost} />;
}

// Also provide a default export for flexibility
export default BlogEditorWrapper; 