
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Eye, MessageSquare } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const TeacherTasks = () => {
  const pendingTasks = [
    {
      id: 1,
      studentName: 'Ahmad Rizki',
      class: 'English Basic',
      submittedAt: '2024-01-20 10:30',
      wordsCount: 5
    },
    {
      id: 2,
      studentName: 'Siti Nurhaliza',
      class: 'English Intermediate',
      submittedAt: '2024-01-20 09:15',
      wordsCount: 5
    },
    {
      id: 3,
      studentName: 'Budi Santoso',
      class: 'English Basic',
      submittedAt: '2024-01-20 08:45',
      wordsCount: 5
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Task Reviews</h1>
          <p className="text-gray-600">Review and grade student submissions</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Reviews</CardTitle>
            <CardDescription>Student tasks waiting for your review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium">{task.studentName}</h3>
                    <p className="text-sm text-gray-600">{task.class} • {task.wordsCount} words</p>
                    <p className="text-xs text-gray-500">Submitted: {task.submittedAt}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Review
                    </Button>
                    <Button size="sm" className="flex items-center space-x-1">
                      <Star className="h-4 w-4" />
                      <span>Grade</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
            <CardDescription>Recently graded submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Student Name {item}</h3>
                    <p className="text-sm text-gray-600">English Basic • 5 words</p>
                    <p className="text-xs text-gray-500">Reviewed: Jan {item}, 2024</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <Star className="h-4 w-4 text-gray-300" />
                    </div>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TeacherTasks;
