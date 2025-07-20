
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Calendar, Star, Users, Clock, Target } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';

const StudentDashboard = () => {
  const { user } = useAuth();

  const { data: todayTask } = useQuery({
    queryKey: ['today-task', user?.id],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('tasks')
        .select('*')
        .eq('student_id', user?.id)
        .eq('submission_date', today)
        .maybeSingle();
      return data;
    },
    enabled: !!user?.id
  });

  const { data: weeklyStats } = useQuery({
    queryKey: ['weekly-stats', user?.id],
    queryFn: async () => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const { data } = await supabase
        .from('tasks')
        .select('stars, submission_date')
        .eq('student_id', user?.id)
        .gte('submission_date', weekAgo.toISOString().split('T')[0]);
      
      return data || [];
    },
    enabled: !!user?.id
  });

  const { data: enrolledClasses } = useQuery({
    queryKey: ['enrolled-classes', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('class_students')
        .select('classes(name)')
        .eq('student_id', user?.id);
      return data || [];
    },
    enabled: !!user?.id
  });

  const completedThisWeek = weeklyStats?.length || 0;
  const averageStars = weeklyStats?.length > 0 
    ? (weeklyStats.reduce((sum, task) => sum + (task.stars || 0), 0) / weeklyStats.length).toFixed(1)
    : '0';
  const todaySubmitted = !!todayTask;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your learning progress.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Classes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrolledClasses?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Enrolled classes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks This Week</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedThisWeek}</div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Stars</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageStars}</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Task</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todaySubmitted ? '✓' : '○'}</div>
              <p className="text-xs text-muted-foreground">
                {todaySubmitted ? 'Submitted' : 'Pending'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Today's Progress
              </CardTitle>
              <CardDescription>
                {todaySubmitted ? 'Great job! You completed today\'s task.' : 'Don\'t forget to submit your daily vocabulary task!'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {todaySubmitted ? (
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-green-800">Task Completed</p>
                    <p className="text-sm text-green-600">
                      {todayTask.stars ? `Reviewed: ${todayTask.stars} stars` : 'Awaiting review'}
                    </p>
                  </div>
                  <div className="flex">
                    {Array.from({ length: todayTask.stars || 0 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-2">No submission yet today</p>
                  <p className="text-sm text-gray-500">Complete your daily vocabulary task to earn stars!</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest learning activities</CardDescription>
            </CardHeader>
            <CardContent>
              {weeklyStats && weeklyStats.length > 0 ? (
                <div className="space-y-2">
                  {weeklyStats.slice(0, 5).map((task, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <span className="text-sm text-gray-600">
                        {new Date(task.submission_date).toLocaleDateString()}
                      </span>
                      <div className="flex">
                        {Array.from({ length: task.stars || 0 }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No activities yet. Start by submitting your first task!
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
