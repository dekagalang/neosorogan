
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface TaskSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TaskSubmissionModal = ({ isOpen, onClose }: TaskSubmissionModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit Task</DialogTitle>
          <DialogDescription>
            Submit your daily vocabulary task here.
          </DialogDescription>
        </DialogHeader>
        <div className="p-4">
          <p className="text-muted-foreground">Task submission form will be implemented here.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskSubmissionModal;
