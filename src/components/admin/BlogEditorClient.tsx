import React from 'react';
import { BlogEditor } from './BlogEditor';
import type { BlogPost } from '../../services/BlogService';

// This component is specifically designed to be used with client:only="react"
export default function BlogEditorClient({ blogPost }: { blogPost?: BlogPost }) {
  return <BlogEditor post={blogPost} />;
} 