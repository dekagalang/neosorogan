
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthContext';
import { Plus, Trash2 } from 'lucide-react';

interface WordEntry {
  word: string;
  meaning: string;
  sentence: string;
  description: string;
}

interface TaskSubmissionFormProps {
  onSubmit: () => void;
  existingTask?: any;
}

const TaskSubmissionForm = ({ onSubmit, existingTask }: TaskSubmissionFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const initialWords: WordEntry[] = existingTask?.words ? 
    (Array.isArray(existingTask.words) ? existingTask.words as WordEntry[] : []) :
    [
      { word: '', meaning: '', sentence: '', description: '' },
      { word: '', meaning: '', sentence: '', description: '' },
      { word: '', meaning: '', sentence: '', description: '' },
      { word: '', meaning: '', sentence: '', description: '' },
      { word: '', meaning: '', sentence: '', description: '' }
    ];

  // Add extra words if there's a penalty
  if (existingTask?.extra_words_penalty > 0) {
    for (let i = 0; i < existingTask.extra_words_penalty; i++) {
      initialWords.push({ word: '', meaning: '', sentence: '', description: '' });
    }
  }

  const [words, setWords] = useState<WordEntry[]>(initialWords);

  const updateWord = (index: number, field: keyof WordEntry, value: string) => {
    const newWords = [...words];
    newWords[index] = { ...newWords[index], [field]: value };
    setWords(newWords);
  };

  const addWord = () => {
    setWords([...words, { word: '', meaning: '', sentence: '', description: '' }]);
  };

  const removeWord = (index: number) => {
    if (words.length > 5) {  // Minimum 5 words required
      setWords(words.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate that all required fields are filled
      const isValid = words.every(word => 
        word.word.trim() && word.meaning.trim() && word.sentence.trim() && word.description.trim()
      );

      if (!isValid) {
        toast({
          title: "Incomplete Form",
          description: "Please fill in all fields for each vocabulary word.",
          variant: "destructive"
        });
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      
      if (existingTask) {
        // Update existing task
        const { error } = await supabase
          .from('tasks')
          .update({
            words: words as any,
            submitted_at: new Date().toISOString()
          })
          .eq('id', existingTask.id);

        if (error) throw error;
        
        toast({
          title: "Task Updated",
          description: "Your vocabulary task has been updated successfully!"
        });
      } else {
        // Create new task
        const { error } = await supabase
          .from('tasks')
          .insert({
            student_id: user?.id,
            submission_date: today,
            words: words as any,
            submitted_at: new Date().toISOString()
          });

        if (error) throw error;
        
        toast({
          title: "Task Submitted",
          description: "Your daily vocabulary task has been submitted successfully!"
        });
      }

      onSubmit();
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Daily Vocabulary Task</CardTitle>
        <CardDescription>
          Submit your 5 vocabulary words with meanings, sample sentences, and descriptions.
          {existingTask?.extra_words_penalty > 0 && (
            <span className="text-orange-600 block mt-1">
              ⚠️ {existingTask.extra_words_penalty} extra words required due to previous missed submission.
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {words.map((word, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">
                  Vocabulary Word {index + 1}
                  {index < 5 && <span className="text-red-500 ml-1">*</span>}
                  {index >= 5 && <span className="text-orange-500 ml-1">(Penalty)</span>}
                </h3>
                {words.length > 5 && index >= 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeWord(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`word-${index}`}>Word</Label>
                  <Input
                    id={`word-${index}`}
                    value={word.word}
                    onChange={(e) => updateWord(index, 'word', e.target.value)}
                    placeholder="Enter the vocabulary word"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor={`meaning-${index}`}>Meaning</Label>
                  <Input
                    id={`meaning-${index}`}
                    value={word.meaning}
                    onChange={(e) => updateWord(index, 'meaning', e.target.value)}
                    placeholder="Enter the meaning"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor={`sentence-${index}`}>Sample Sentence</Label>
                <Textarea
                  id={`sentence-${index}`}
                  value={word.sentence}
                  onChange={(e) => updateWord(index, 'sentence', e.target.value)}
                  placeholder="Write a sample sentence using this word"
                  className="min-h-[60px]"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor={`description-${index}`}>Description</Label>
                <Textarea
                  id={`description-${index}`}
                  value={word.description}
                  onChange={(e) => updateWord(index, 'description', e.target.value)}
                  placeholder="Provide additional description or context"
                  className="min-h-[60px]"
                  required
                />
              </div>
            </div>
          ))}
          
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={addWord}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Extra Word
            </Button>
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Submitting...' : (existingTask ? 'Update Task' : 'Submit Task')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TaskSubmissionForm;
