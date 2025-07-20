
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface TaskReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId?: string;
}

const TaskReviewModal = ({ isOpen, onClose, taskId }: TaskReviewModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review Task</DialogTitle>
          <DialogDescription>
            Review and grade student task submission.
          </DialogDescription>
        </DialogHeader>
        <div className="p-4">
          <p className="text-muted-foreground">Task review interface will be implemented here.</p>
          {taskId && <p className="text-sm text-gray-500">Task ID: {taskId}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskReviewModal;
