import React from 'react';
import { BlogEditor } from './admin/BlogEditor';

// This component MUST be used with a direct import statement
// when using client:only directive in Astro
export default function BlogEditorClientOnly(props) {
  // Simply pass through props to the BlogEditor component
  return <BlogEditor post={props.blogPost} />;
} 