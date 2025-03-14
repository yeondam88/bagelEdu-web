import React from 'react';
import { BlogEditor } from './admin/BlogEditor';

// Simple React component used with client:only
export default function BlogEditorClient(props) {
  return <BlogEditor post={props.blogPost} />;
} 