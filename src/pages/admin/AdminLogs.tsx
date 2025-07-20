
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, User, Server } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const AdminLogs = () => {
  const userLogs = [
    { id: 1, user: 'Ahmad Rizki', action: 'Login', timestamp: '2024-01-20 10:30:00', details: 'Successful login' },
    { id: 2, user: 'Siti Nurhaliza', action: 'Task Submitted', timestamp: '2024-01-20 10:15:00', details: '5 vocabulary words submitted' },
    { id: 3, user: 'Ms. Sarah', action: 'Material Uploaded', timestamp: '2024-01-20 09:45:00', details: 'Grammar Basics PDF uploaded' },
    { id: 4, user: 'Ahmad Rizki', action: 'Profile Updated', timestamp: '2024-01-20 09:30:00', details: 'Changed profile information' },
  ];

  const systemLogs = [
    { id: 1, event: 'Database Backup', status: 'Success', timestamp: '2024-01-20 02:00:00', details: 'Daily backup completed' },
    { id: 2, event: 'Penalty Check', status: 'Success', timestamp: '2024-01-20 00:01:00', details: 'Applied penalties for missed submissions' },
    { id: 3, event: 'System Update', status: 'Success', timestamp: '2024-01-19 23:30:00', details: 'Security patches applied' },
    { id: 4, event: 'Email Service', status: 'Warning', timestamp: '2024-01-19 15:20:00', details: 'Temporary delay in email delivery' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Logs</h1>
          <p className="text-gray-600">Monitor user activities and system events</p>
        </div>

        <Tabs defaultValue="user-activity" className="space-y-4">
          <TabsList>
            <TabsTrigger value="user-activity" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>User Activity</span>
            </TabsTrigger>
            <TabsTrigger value="system-logs" className="flex items-center space-x-2">
              <Server className="h-4 w-4" />
              <span>System Logs</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="user-activity">
            <Card>
              <CardHeader>
                <CardTitle>User Activity Logs</CardTitle>
                <CardDescription>Track all user actions and activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userLogs.map((log) => (
                    <div key={log.id} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                      <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{log.user}</h3>
                          <span className="text-sm text-gray-500">{log.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-600">{log.action}</p>
                        <p className="text-xs text-gray-500 mt-1">{log.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system-logs">
            <Card>
              <CardHeader>
                <CardTitle>System Event Logs</CardTitle>
                <CardDescription>Monitor system events and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemLogs.map((log) => (
                    <div key={log.id} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                      <div className={`w-3 h-3 rounded-full mt-2 ${
                        log.status === 'Success' ? 'bg-green-500' :
                        log.status === 'Warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{log.event}</h3>
                          <span className="text-sm text-gray-500">{log.timestamp}</span>
                        </div>
                        <p className={`text-sm font-medium ${
                          log.status === 'Success' ? 'text-green-600' :
                          log.status === 'Warning' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {log.status}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{log.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminLogs;
