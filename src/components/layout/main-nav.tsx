import { cn } from "../lib/utils";

export interface NavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  external?: boolean;
  label?: string;
}

interface MainNavProps {
  items: NavItem[];
  currentPath: string;
}

export function MainNav({ items, currentPath }: MainNavProps) {
  return (
    <div className="flex gap-6 md:gap-10">
      <nav className="flex flex-col space-y-1 w-full">
        {items.map((item) => {
          // Check if the current item's href matches the currentPath
          // or if it's a sub-path of the currentPath
          const isActive = 
            currentPath === item.href || 
            (currentPath.startsWith(item.href) && item.href !== '/admin');
          
          // Exception for root admin path - only exact match should be active
          const isRootAdmin = item.href === '/admin';
          const isActiveRoot = isRootAdmin && currentPath === '/admin';

          return (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center py-2 px-3 rounded-md text-sm font-medium transition-colors",
                (isRootAdmin ? isActiveRoot : isActive)
                  ? "bg-accent text-accent-foreground"
                  : "transparent hover:bg-accent/50 hover:text-accent-foreground",
                item.disabled && "cursor-not-allowed opacity-80"
              )}
            >
              {item.icon && <span className="mr-3">{item.icon}</span>}
              <span>{item.title}</span>
              {item.label && (
                <span className="ml-auto bg-primary/10 text-primary px-2 py-0.5 rounded-md text-xs">
                  {item.label}
                </span>
              )}
            </a>
          );
        })}
      </nav>
    </div>
  );
} 