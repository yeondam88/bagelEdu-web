import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/components/ui/card";
import { Icons } from "../ui/icons";

interface DashboardStatsProps {
  stats: {
    blogs: number;
    programs: number;
    testimonials: number;
    faqs: number;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Blog Posts
          </CardTitle>
          <Icons.blog className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.blogs}</div>
          <p className="text-xs text-muted-foreground">
            Published blog posts
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Programs
          </CardTitle>
          <Icons.program className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.programs}</div>
          <p className="text-xs text-muted-foreground">
            Active programs
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Testimonials
          </CardTitle>
          <Icons.testimonial className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.testimonials}</div>
          <p className="text-xs text-muted-foreground">
            Customer testimonials
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            FAQs
          </CardTitle>
          <Icons.faq className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.faqs}</div>
          <p className="text-xs text-muted-foreground">
            Frequently asked questions
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 