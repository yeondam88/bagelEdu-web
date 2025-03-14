import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import slugify from 'slugify';
import { createClient } from '@supabase/supabase-js';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { BlogPost } from '../../services/BlogService';

// Import UI components
import { Button } from '../../components/components/ui/button';
import { Input } from '../../components/components/ui/input';
import { Textarea } from '../../components/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/components/ui/card';
import { Loader2, Save, X } from 'lucide-react';

// Validation schema for blog post
const blogPostSchema = z.object({
  title: z.object({
    en: z.string().min(1, "English title is required"),
    ko: z.string().optional(),
  }),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.object({
    en: z.string().optional(),
    ko: z.string().optional(),
  }).optional(),
  featured_image: z.string().optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  published_at: z.string().optional(),
});

type BlogFormValues = z.infer<typeof blogPostSchema>;

// Props for the BlogEditor component
interface BlogEditorProps {
  post?: BlogPost;
  onSubmit?: (data: BlogPost) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}

export function BlogEditor({
  post,
  onSubmit,
  onCancel,
  isLoading = false,
  supabaseUrl,
  supabaseAnonKey,
}: BlogEditorProps) {
  const [activeTab, setActiveTab] = useState<string>("en");
  const [generatedSlug, setGeneratedSlug] = useState<string>("");
  const [supabase, setSupabase] = useState<any>(null);

  // Initialize Supabase client if URLs are provided
  useEffect(() => {
    if (supabaseUrl && supabaseAnonKey) {
      const client = createClient(supabaseUrl, supabaseAnonKey);
      setSupabase(client);
    }
  }, [supabaseUrl, supabaseAnonKey]);

  // Initialize form
  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: {
        en: post?.title && typeof post.title === 'object' ? post.title.en || '' : 
             typeof post?.title === 'string' ? post.title : '',
        ko: post?.title && typeof post.title === 'object' ? post.title.ko || '' : '',
      },
      slug: post?.slug || '',
      content: post?.content || '',
      excerpt: {
        en: post?.excerpt && typeof post.excerpt === 'object' ? post.excerpt.en || '' : 
            typeof post?.excerpt === 'string' ? post.excerpt : '',
        ko: post?.excerpt && typeof post.excerpt === 'object' ? post.excerpt.ko || '' : '',
      },
      featured_image: post?.featured_image || '',
      category: post?.category || '',
      tags: post?.tags ? post.tags.join(', ') : '',
      status: (post?.status as any) || 'draft',
      published_at: post?.published_at ? 
        new Date(post.published_at).toISOString().split('T')[0] : 
        new Date().toISOString().split('T')[0],
    },
  });

  // Generate slug from title
  const generateSlug = (title: string) => {
    if (!title) return '';
    return slugify(title, { lower: true, strict: true });
  };

  // Handle title change to auto-generate slug
  const handleTitleChange = (value: string, lang: string) => {
    if (lang === 'en' && !post?.slug) {
      const newSlug = generateSlug(value);
      setGeneratedSlug(newSlug);
      form.setValue('slug', newSlug);
    }
    
    const currentTitle = form.getValues('title');
    form.setValue('title', { ...currentTitle, [lang]: value });
  };

  // Handle form submission
  const onFormSubmit = async (data: BlogFormValues) => {
    if (!onSubmit) return;

    // Format tags from comma-separated string to array
    const tags = data.tags ? 
      data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : 
      [];

    // Convert form data to BlogPost format
    const blogPost: BlogPost = {
      id: post?.id,
      slug: data.slug,
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      featured_image: data.featured_image,
      category: data.category || 'Uncategorized',
      tags,
      status: data.status,
      published_at: data.published_at ? new Date(data.published_at).toISOString() : undefined,
    };

    // Submit the data
    await onSubmit(blogPost);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Title and multilingual tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Blog Post Title</CardTitle>
            <CardDescription>
              Enter the title in multiple languages. English is required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="en" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="ko">Korean</TabsTrigger>
              </TabsList>
              <TabsContent value="en">
                <FormField
                  control={form.control}
                  name="title.en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title (English)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter title in English"
                          {...field}
                          onChange={(e) => handleTitleChange(e.target.value, 'en')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              <TabsContent value="ko">
                <FormField
                  control={form.control}
                  name="title.ko"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title (Korean)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter title in Korean"
                          {...field}
                          onChange={(e) => handleTitleChange(e.target.value, 'ko')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Slug */}
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="post-url-slug" {...field} />
              </FormControl>
              <FormDescription>
                URL-friendly identifier for the blog post. Auto-generated from English title.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Content */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Blog post content (Markdown supported)"
                  className="min-h-[300px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter the content of the blog post. Markdown and HTML are supported.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Excerpt tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Excerpt</CardTitle>
            <CardDescription>
              A short summary of the blog post in multiple languages.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="en" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="ko">Korean</TabsTrigger>
              </TabsList>
              <TabsContent value="en">
                <FormField
                  control={form.control}
                  name="excerpt.en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt (English)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter excerpt in English"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              <TabsContent value="ko">
                <FormField
                  control={form.control}
                  name="excerpt.ko"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt (Korean)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter excerpt in Korean"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Featured Image */}
        <FormField
          control={form.control}
          name="featured_image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Featured Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormDescription>
                URL to the featured image for the blog post.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="Blog post category" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tags */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input placeholder="tag1, tag2, tag3" {...field} />
              </FormControl>
              <FormDescription>
                Comma-separated list of tags.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status and Publication */}
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="published_at"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Publication Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button 
              variant="outline" 
              type="button" 
              onClick={onCancel}
              disabled={isLoading}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {post?.id ? 'Update' : 'Create'} Post
          </Button>
        </div>
      </form>
    </Form>
  );
}

// Create a default export that references the BlogEditor
export default BlogEditor; 