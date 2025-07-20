
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TaskSubmissionForm from '@/components/student/TaskSubmissionForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Star, Clock, CheckCircle } from 'lucide-react';

const StudentTasks = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);

  const { data: todayTask, refetch: refetchTodayTask } = useQuery({
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

  const { data: allTasks } = useQuery({
    queryKey: ['all-tasks', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('tasks')
        .select('*')
        .eq('student_id', user?.id)
        .order('submission_date', { ascending: false });
      return data || [];
    },
    enabled: !!user?.id
  });

  const { data: selectedDateTask } = useQuery({
    queryKey: ['selected-date-task', user?.id, selectedDate],
    queryFn: async () => {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const { data } = await supabase
        .from('tasks')
        .select('*')
        .eq('student_id', user?.id)
        .eq('submission_date', dateStr)
        .maybeSingle();
      return data;
    },
    enabled: !!user?.id && !!selectedDate
  });

  const handleTaskSubmit = () => {
    setShowSubmissionForm(false);
    refetchTodayTask();
  };

  const getDateStatus = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const task = allTasks?.find(t => t.submission_date === dateStr);
    
    if (!task) return null;
    if (task.stars) return 'reviewed';
    return 'submitted';
  };

  const renderStars = (count: number) => {
    return Array.from({ length: count }).map((_, i) => (
      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
    ));
  };

  if (showSubmissionForm) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Submit Daily Task</h1>
            <Button variant="outline" onClick={() => setShowSubmissionForm(false)}>
              Back to Tasks
            </Button>
          </div>
          <TaskSubmissionForm onSubmit={handleTaskSubmit} existingTask={todayTask} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Daily Tasks</h1>
            <p className="text-gray-600">Submit and track your vocabulary tasks</p>
          </div>
          {!todayTask && (
            <Button onClick={() => setShowSubmissionForm(true)}>
              Submit Today's Task
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Task Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Today's Progress
                </CardTitle>
                <CardDescription>
                  {new Date().toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {todayTask ? (
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-800">Task Completed</span>
                      </div>
                      <p className="text-sm text-green-600">
                        Submitted: {new Date(todayTask.submitted_at).toLocaleTimeString()}
                      </p>
                      {todayTask.stars && (
                        <p className="text-sm text-green-600">
                          Review: {renderStars(todayTask.stars)}
                        </p>
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowSubmissionForm(true)}
                    >
                      Edit Task
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="font-medium text-gray-900 mb-2">No submission yet</h3>
                    <p className="text-gray-600 mb-4">Don't forget to submit your daily vocabulary task!</p>
                    <Button onClick={() => setShowSubmissionForm(true)}>
                      Submit Now
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Selected Date Task Details */}
            {selectedDateTask && (
              <Card>
                <CardHeader>
                  <CardTitle>Task Details - {selectedDate.toLocaleDateString()}</CardTitle>
                  <CardDescription>
                    {selectedDateTask.stars ? 'Reviewed' : 'Awaiting Review'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedDateTask.stars && (
                      <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                        <span className="font-medium">Rating:</span>
                        <div className="flex">{renderStars(selectedDateTask.stars)}</div>
                      </div>
                    )}
                    
                    {selectedDateTask.comment && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <span className="font-medium">Teacher's Comment:</span>
                        <p className="mt-1 text-gray-700">{selectedDateTask.comment}</p>
                      </div>
                    )}

                    <div className="space-y-3">
                      <h4 className="font-medium">Vocabulary Words:</h4>
                      {selectedDateTask.words.map((word: any, index: number) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div><strong>Word:</strong> {word.word}</div>
                            <div><strong>Meaning:</strong> {word.meaning}</div>
                            <div className="md:col-span-2"><strong>Sentence:</strong> {word.sentence}</div>
                            <div className="md:col-span-2"><strong>Description:</strong> {word.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Calendar and Task History */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Calendar</CardTitle>
                <CardDescription>Click on a date to view task details</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                  modifiers={{
                    submitted: (date) => getDateStatus(date) === 'submitted',
                    reviewed: (date) => getDateStatus(date) === 'reviewed'
                  }}
                  modifiersStyles={{
                    submitted: { backgroundColor: '#fef3c7', color: '#92400e' },
                    reviewed: { backgroundColor: '#d1fae5', color: '#065f46' }
                  }}
                />
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-200 rounded"></div>
                    <span>Reviewed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-200 rounded"></div>
                    <span>Submitted</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentTasks;
