// Explicit file just for client:only directive
import React from 'react';
import { BlogEditor } from './BlogEditor';

export default function ClientBlogEditor(props) {
  // Log for debugging
  console.log("ClientBlogEditor rendering with props:", props);
  
  // Explicitly return the BlogEditor with post prop
  return <BlogEditor post={props.blogPost} />;
} 