import React from 'react';
import { BlogEditor } from '../../../../../components/admin/BlogEditor';

// Simple wrapper component specifically for client:only usage
export default function ReactBlogEditor({ blogPost }) {
  return <BlogEditor post={blogPost} />;
}
