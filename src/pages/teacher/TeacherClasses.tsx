
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Users, Settings } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useToast } from '@/hooks/use-toast';

const TeacherClasses = () => {
  const { toast } = useToast();
  const [classes, setClasses] = useState([
    {
      id: 1,
      name: 'English Basic',
      description: 'Basic English for beginners',
      students: 20,
      createdAt: '2024-01-01'
    },
    {
      id: 2,
      name: 'English Intermediate',
      description: 'Intermediate level English',
      students: 15,
      createdAt: '2024-01-05'
    },
    {
      id: 3,
      name: 'English Advanced',
      description: 'Advanced English conversation',
      students: 10,
      createdAt: '2024-01-10'
    }
  ]);

  const [newClassName, setNewClassName] = useState('');
  const [newClassDescription, setNewClassDescription] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const createClass = () => {
    if (!newClassName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a class name",
        variant: "destructive"
      });
      return;
    }

    const newClass = {
      id: Date.now(),
      name: newClassName,
      description: newClassDescription,
      students: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setClasses([...classes, newClass]);
    setNewClassName('');
    setNewClassDescription('');
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Success",
      description: `Class "${newClassName}" created successfully!`
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Classes</h1>
            <p className="text-gray-600">Manage your classes and students</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Create Class</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Class</DialogTitle>
                <DialogDescription>
                  Create a new class for your students
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="className">Class Name</Label>
                  <Input
                    id="className"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder="Enter class name"
                  />
                </div>
                <div>
                  <Label htmlFor="classDescription">Description</Label>
                  <Input
                    id="classDescription"
                    value={newClassDescription}
                    onChange={(e) => setNewClassDescription(e.target.value)}
                    placeholder="Enter class description"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createClass}>Create Class</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => (
            <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{classItem.name}</CardTitle>
                    <CardDescription>{classItem.description}</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Students</span>
                    </div>
                    <span className="font-semibold">{classItem.students}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Created</span>
                    <span className="text-sm font-medium">{classItem.createdAt}</span>
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1">
                      View Students
                    </Button>
                    <Button size="sm" className="flex-1">
                      Manage
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherClasses;
