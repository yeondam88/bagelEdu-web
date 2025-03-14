import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/components/ui/card";

interface ContentChartProps {
  stats: {
    blogs: number;
    programs: number;
    testimonials: number;
    faqs: number;
  };
}

export function ContentChart({ stats }: ContentChartProps) {
  const maxValue = Math.max(stats.blogs, stats.programs, stats.testimonials, stats.faqs);
  const calculateHeight = (value: number) => {
    return maxValue > 0 ? (value / maxValue) * 100 : 0;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-56 flex items-end justify-around gap-4">
          {/* Blogs Bar */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 bg-gray-100 rounded-t-md relative">
              <div 
                className="w-full bg-blue-500 absolute bottom-0 rounded-t-md transition-all duration-500"
                style={{ height: `${calculateHeight(stats.blogs)}%` }}
              ></div>
            </div>
            <div className="text-xs font-medium">Blogs</div>
            <div className="text-sm font-bold">{stats.blogs}</div>
          </div>
          
          {/* Programs Bar */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 bg-gray-100 rounded-t-md relative">
              <div 
                className="w-full bg-green-500 absolute bottom-0 rounded-t-md transition-all duration-500"
                style={{ height: `${calculateHeight(stats.programs)}%` }}
              ></div>
            </div>
            <div className="text-xs font-medium">Programs</div>
            <div className="text-sm font-bold">{stats.programs}</div>
          </div>
          
          {/* Testimonials Bar */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 bg-gray-100 rounded-t-md relative">
              <div 
                className="w-full bg-purple-500 absolute bottom-0 rounded-t-md transition-all duration-500"
                style={{ height: `${calculateHeight(stats.testimonials)}%` }}
              ></div>
            </div>
            <div className="text-xs font-medium">Testimonials</div>
            <div className="text-sm font-bold">{stats.testimonials}</div>
          </div>
          
          {/* FAQs Bar */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 bg-gray-100 rounded-t-md relative">
              <div 
                className="w-full bg-amber-500 absolute bottom-0 rounded-t-md transition-all duration-500"
                style={{ height: `${calculateHeight(stats.faqs)}%` }}
              ></div>
            </div>
            <div className="text-xs font-medium">FAQs</div>
            <div className="text-sm font-bold">{stats.faqs}</div>
          </div>
        </div>
        
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Content distribution across different types
        </div>
      </CardContent>
    </Card>
  );
} 