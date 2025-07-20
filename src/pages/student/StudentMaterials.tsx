
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/layout/DashboardLayout';

const StudentMaterials = () => {
  const materials = [
    {
      id: 1,
      title: 'English Grammar Basics',
      description: 'Fundamental grammar rules and exercises',
      type: 'PDF',
      uploadedBy: 'Ms. Sarah',
      uploadedAt: '2024-01-15',
      class: 'English Basic'
    },
    {
      id: 2,
      title: 'Vocabulary List - Week 1',
      description: '50 essential English words for beginners',
      type: 'PDF',
      uploadedBy: 'Ms. Sarah',
      uploadedAt: '2024-01-10',
      class: 'English Basic'
    },
    {
      id: 3,
      title: 'Pronunciation Guide',
      description: 'Audio guide for correct English pronunciation',
      type: 'Audio',
      uploadedBy: 'Mr. John',
      uploadedAt: '2024-01-08',
      class: 'English Intermediate'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Learning Materials</h1>
          <p className="text-gray-600">Access all your class materials and resources</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((material) => (
            <Card key={material.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {material.type}
                  </span>
                </div>
                <CardTitle className="text-lg">{material.title}</CardTitle>
                <CardDescription>{material.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Class:</span> {material.class}</p>
                  <p><span className="font-medium">Uploaded by:</span> {material.uploadedBy}</p>
                  <p><span className="font-medium">Date:</span> {material.uploadedAt}</p>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentMaterials;
