import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Users, GraduationCap, BookOpen, Calendar, TrendingUp, AlertCircle } from "lucide-react";
import { Badge } from "./ui/badge";

const stats = [
  {
    title: "Total Students",
    value: "1,247",
    description: "+12% from last month",
    icon: Users,
    trend: "up"
  },
  {
    title: "Active Teachers",
    value: "68",
    description: "4 new this semester",
    icon: GraduationCap,
    trend: "up"
  },
  {
    title: "Classes",
    value: "32",
    description: "Across 8 grades",
    icon: BookOpen,
    trend: "stable"
  },
  {
    title: "Attendance Rate",
    value: "94.2%",
    description: "This week average",
    icon: Calendar,
    trend: "up"
  }
];

const recentActivities = [
  {
    id: 1,
    type: "enrollment",
    message: "5 new students enrolled in Grade 10",
    time: "2 hours ago",
    priority: "medium"
  },
  {
    id: 2,
    type: "attendance",
    message: "Low attendance alert for Class 8A",
    time: "4 hours ago",
    priority: "high"
  },
  {
    id: 3,
    type: "grades",
    message: "Grade 12 final exam results published",
    time: "1 day ago",
    priority: "low"
  },
  {
    id: 4,
    type: "teacher",
    message: "New math teacher Sarah Johnson added",
    time: "2 days ago",
    priority: "medium"
  }
];

const upcomingEvents = [
  {
    id: 1,
    title: "Parent-Teacher Conference",
    date: "Dec 15, 2024",
    time: "9:00 AM",
    type: "meeting"
  },
  {
    id: 2,
    title: "Science Fair",
    date: "Dec 20, 2024",
    time: "10:00 AM",
    type: "event"
  },
  {
    id: 3,
    title: "Winter Break Begins",
    date: "Dec 23, 2024",
    time: "All Day",
    type: "holiday"
  }
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1>School Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening at your school today.
        </p>
      </div>

      {/* Stats Grid */}
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Latest updates and notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {activity.priority === "high" && (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}
                  {activity.priority === "medium" && (
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                  )}
                  {activity.priority === "low" && (
                    <div className="h-4 w-4 rounded-full bg-green-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <Badge 
                  variant={activity.priority === "high" ? "destructive" : "secondary"}
                  className="text-xs"
                >
                  {activity.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>
              Important dates and deadlines
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {event.date} at {event.time}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {event.type}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}