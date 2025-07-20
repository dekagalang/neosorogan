
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const AdminUsers = () => {
  const users = [
    { id: 1, name: 'Ahmad Rizki', email: 'ahmad@example.com', role: 'Student', joinDate: '2024-01-15' },
    { id: 2, name: 'Siti Nurhaliza', email: 'siti@example.com', role: 'Student', joinDate: '2024-01-12' },
    { id: 3, name: 'Ms. Sarah', email: 'sarah@example.com', role: 'Teacher', joinDate: '2024-01-01' },
    { id: 4, name: 'Mr. John', email: 'john@example.com', role: 'Teacher', joinDate: '2024-01-01' },
    { id: 5, name: 'Admin User', email: 'admin@example.com', role: 'Admin', joinDate: '2024-01-01' }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Manage all users in the system</p>
          </div>
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add User</span>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>View and manage all registered users</CardDescription>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search users..." className="pl-8" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'Teacher' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell>{user.joinDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;
