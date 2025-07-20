
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Edit, Trash2 } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const TeacherMaterials = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Materials Management</h1>
            <p className="text-gray-600">Upload and manage learning materials</p>
          </div>
          <Button className="flex items-center space-x-2">
            <Upload className="h-4 w-4" />
            <span>Upload Material</span>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>My Materials</CardTitle>
            <CardDescription>Manage all your uploaded materials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-medium">Grammar Basics {item}</h3>
                      <p className="text-sm text-gray-600">Uploaded on Jan {item}, 2024</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
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

export default TeacherMaterials;
