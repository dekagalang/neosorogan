
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, CheckCircle, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';

const TeacherDashboard = () => {
  const { user } = useAuth();

  const { data: teacherClasses } = useQuery({
    queryKey: ['teacher-classes', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('classes')
        .select(`
          *,
          class_students(count)
        `)
        .eq('teacher_id', user?.id);
      return data || [];
    },
    enabled: !!user?.id
  });

  const { data: pendingTasks } = useQuery({
    queryKey: ['pending-tasks', user?.id],
    queryFn: async () => {
      const classIds = teacherClasses?.map(c => c.id) || [];
      if (classIds.length === 0) return [];

      const { data } = await supabase
        .from('tasks')
        .select('*')
        .in('class_id', classIds)
        .is('stars', null);
      return data || [];
    },
    enabled: !!teacherClasses?.length
  });

  const { data: materialsCount } = useQuery({
    queryKey: ['materials-count', user?.id],
    queryFn: async () => {
      const classIds = teacherClasses?.map(c => c.id) || [];
      if (classIds.length === 0) return 0;

      const { count } = await supabase
        .from('materials')
        .select('*', { count: 'exact' })
        .in('class_id', classIds);
      return count || 0;
    },
    enabled: !!teacherClasses?.length
  });

  const totalStudents = teacherClasses?.reduce((sum, cls) => 
    sum + (cls.class_students?.[0]?.count || 0), 0) || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="text-gray-600">Manage your classes and review student progress.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Classes</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teacherClasses?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Active classes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">Across all classes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTasks?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Tasks to review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Materials</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{materialsCount}</div>
              <p className="text-xs text-muted-foreground">Uploaded materials</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>My Classes</CardTitle>
              <CardDescription>Overview of your teaching classes</CardDescription>
            </CardHeader>
            <CardContent>
              {teacherClasses && teacherClasses.length > 0 ? (
                <div className="space-y-3">
                  {teacherClasses.map((cls) => (
                    <div key={cls.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <h3 className="font-medium">{cls.name}</h3>
                        <p className="text-sm text-gray-600">
                          {cls.class_students?.[0]?.count || 0} students
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          Created {new Date(cls.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No classes yet. Create your first class to get started!
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest student submissions</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingTasks && pendingTasks.length > 0 ? (
                <div className="space-y-3">
                  {pendingTasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div>
                        <p className="font-medium">New submission</p>
                        <p className="text-sm text-gray-600">
                          {new Date(task.submitted_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                        Pending Review
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No pending reviews. All caught up!
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
