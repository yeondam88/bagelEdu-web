import React from "react";
import { MainNav, type NavItem } from "./main-nav";
import { Icons } from "../ui/icons";

interface SidebarProps {
  currentPath: string;
}

export function Sidebar({ currentPath }: SidebarProps) {
  // Define sidebar items with their icons
  const sidebarNavItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: <Icons.dashboard className="h-5 w-5" />,
    },
    {
      title: "Blog Posts",
      href: "/admin/content/blog",
      icon: <Icons.blog className="h-5 w-5" />,
    },
    {
      title: "Programs",
      href: "/admin/content/programs",
      icon: <Icons.program className="h-5 w-5" />,
    },
    {
      title: "Testimonials",
      href: "/admin/content/testimonials",
      icon: <Icons.testimonial className="h-5 w-5" />,
    },
    {
      title: "FAQs",
      href: "/admin/content/faqs",
      icon: <Icons.faq className="h-5 w-5" />,
    },
    {
      title: "Media Library",
      href: "/admin/media",
      icon: <Icons.media className="h-5 w-5" />,
    },
  ];

  return (
    <aside className="hidden md:flex w-64 flex-col bg-card border-r border-border h-screen sticky top-0">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold">Bagel Admin</h1>
      </div>
      
      <div className="flex-1 p-4">
        <MainNav items={sidebarNavItems} currentPath={currentPath} />
      </div>
    </aside>
  );
} 