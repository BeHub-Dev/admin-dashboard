"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FolderKanban, TrendingUp, Users, Star } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Categories",
      value: "0",
      description: "Active service categories",
      icon: FolderKanban,
      trend: "+0%",
    },
    {
      title: "Total Providers",
      value: "0",
      description: "Registered service providers",
      icon: Users,
      trend: "+0%",
    },
    {
      title: "Total Bookings",
      value: "0",
      description: "All time bookings",
      icon: TrendingUp,
      trend: "+0%",
    },
    {
      title: "Average Rating",
      value: "0.0",
      description: "Overall platform rating",
      icon: Star,
      trend: "0.0",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to the BeHub Admin Dashboard
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Get started with managing your platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              Navigate to Service Categories to start managing your service
              offerings.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
