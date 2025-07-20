
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Calendar, Star, Users } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/components/auth/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.email}!</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks Today</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Words to submit</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4/7</div>
              <p className="text-xs text-muted-foreground">Days completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Stars</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.5</div>
              <p className="text-xs text-muted-foreground">Out of 3 stars</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Classes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Enrolled</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Tasks</CardTitle>
              <CardDescription>Your latest vocabulary submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Today's Task</p>
                    <p className="text-sm text-gray-600">5 words pending</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-gray-300" />
                    <Star className="h-4 w-4 text-gray-300" />
                    <Star className="h-4 w-4 text-gray-300" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium">Yesterday</p>
                    <p className="text-sm text-gray-600">Completed</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <Star className="h-4 w-4 text-gray-300" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Calendar Overview</CardTitle>
              <CardDescription>Your progress this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 text-center text-sm">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                  <div key={day} className="font-medium text-gray-500 p-2">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 28 }, (_, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded ${
                      i % 7 === 0 || i % 7 === 6
                        ? 'bg-gray-100'
                        : i < 20
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
