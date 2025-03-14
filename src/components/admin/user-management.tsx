import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/components/ui/card";

export interface User {
  id: string;
  email: string;
  role?: string;
  lastActive?: string;
  name?: string;
  avatar_url?: string;
}

interface UserManagementProps {
  users: User[];
  currentUser?: User;
}

export function UserManagement({ users, currentUser }: UserManagementProps) {
  // Handle image error by displaying fallback
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.display = "none";
    // Find the next sibling (which is the fallback initial)
    const nextElement = event.currentTarget.nextElementSibling as HTMLElement;
    if (nextElement) {
      nextElement.style.display = "flex";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>User Management</CardTitle>
        <button className="text-sm text-primary hover:underline">
          Invite User
        </button>
      </CardHeader>
      <CardContent>
        {users.length > 0 ? (
          <div className="divide-y divide-border">
            {users.map((user) => (
              <div 
                key={user.id} 
                className={`py-3 flex items-center justify-between ${
                  currentUser?.id === user.id ? 'bg-muted/40' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {user.avatar_url ? (
                    <>
                      <img 
                        src={user.avatar_url} 
                        alt={user.name || user.email}
                        className="w-8 h-8 rounded-full object-cover"
                        onError={handleImageError}
                      />
                      <div 
                        className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium"
                        style={{ display: 'none' }}
                      >
                        {(user.name || user.email || "U").charAt(0).toUpperCase()}
                      </div>
                    </>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                      {(user.name || user.email || "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-sm">
                      {user.name || user.email}
                      {currentUser?.id === user.id && (
                        <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                          You
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {user.role || "User"} • {user.lastActive ? `Last active ${user.lastActive}` : "Never active"}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="text-sm text-muted-foreground hover:text-foreground">
                    Edit
                  </button>
                  {currentUser?.id !== user.id && (
                    <button className="text-sm text-red-600 hover:text-red-700">
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>No users found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 