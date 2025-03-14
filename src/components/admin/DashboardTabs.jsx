import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/components/ui/tabs';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../../components/components/ui/card';

export default function DashboardTabs({ contentCounts }) {
  return (
    <Tabs defaultValue="overview" className="mb-6">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="recent">Recent Content</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-6">
        {/* Content stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contentCounts.blogPosts}</div>
              <p className="text-xs text-muted-foreground">Published articles</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Programs</CardTitle>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contentCounts.programs}</div>
              <p className="text-xs text-muted-foreground">Active programs</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Testimonials</CardTitle>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contentCounts.testimonials}</div>
              <p className="text-xs text-muted-foreground">Customer reviews</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">FAQs</CardTitle>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contentCounts.faqs}</div>
              <p className="text-xs text-muted-foreground">Questions answered</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Perform common tasks quickly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <QuickActionLink 
                href="/admin/content/blog/new" 
                title="Create Blog Post"
                description="Write a new article for the blog"
              />
              
              <QuickActionLink 
                href="/admin/content/programs/new" 
                title="Add Program"
                description="Create a new program offering"
              />
              
              <QuickActionLink 
                href="/admin/content/testimonials/new" 
                title="Add Testimonial"
                description="Add a new customer testimonial"
              />
              
              <QuickActionLink 
                href="/admin/media/upload" 
                title="Upload Media"
                description="Add images to the media library"
                icon="upload"
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="recent">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest changes to your content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-10 text-muted-foreground">
              <p>Loading activity data...</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="analytics">
        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>Site traffic and content metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-10 text-muted-foreground">
              <p>Analytics integration coming soon</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function QuickActionLink({ href, title, description, icon = "plus" }) {
  return (
    <a href={href} className="flex items-center p-4 border rounded-lg hover:bg-accent/50 transition">
      <div className="mr-4 bg-primary/10 p-2.5 rounded-full">
        {icon === "plus" ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        )}
      </div>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </a>
  );
} 