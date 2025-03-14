import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/components/ui/card";

export interface ActivityItem {
  id: string;
  action: string;
  resource: string;
  timestamp: string;
  user?: string;
}

interface ActivityLogProps {
  activities: ActivityItem[];
}

export function ActivityLog({ activities }: ActivityLogProps) {
  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create':
        return 'text-green-600';
      case 'update':
        return 'text-blue-600';
      case 'delete':
        return 'text-red-600';
      default:
        return 'text-slate-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-2 pb-3 border-b border-border">
                <div className={`w-2 h-2 mt-2 rounded-full ${getActionColor(activity.action)}`} />
                <div className="flex-1 space-y-1">
                  <p className="text-sm leading-tight">
                    <span className={`font-medium ${getActionColor(activity.action)}`}>
                      {activity.action}
                    </span>{' '}
                    {activity.resource}
                    {activity.user && <span className="text-muted-foreground"> by {activity.user}</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>No recent activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 