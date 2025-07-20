
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Star, Calendar } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useToast } from '@/hooks/use-toast';

interface VocabularyWord {
  id: string;
  word: string;
  meaning: string;
  sentence: string;
  description: string;
}

const StudentTasks = () => {
  const { toast } = useToast();
  const [words, setWords] = useState<VocabularyWord[]>([
    { id: '1', word: '', meaning: '', sentence: '', description: '' }
  ]);

  const addWord = () => {
    if (words.length < 5) {
      setWords([...words, {
        id: Date.now().toString(),
        word: '',
        meaning: '',
        sentence: '',
        description: ''
      }]);
    }
  };

  const updateWord = (id: string, field: keyof VocabularyWord, value: string) => {
    setWords(words.map(word => 
      word.id === id ? { ...word, [field]: value } : word
    ));
  };

  const removeWord = (id: string) => {
    if (words.length > 1) {
      setWords(words.filter(word => word.id !== id));
    }
  };

  const submitTask = () => {
    // Validate all fields are filled
    const isValid = words.every(word => 
      word.word.trim() && word.meaning.trim() && word.sentence.trim() && word.description.trim()
    );

    if (!isValid) {
      toast({
        title: "Incomplete Submission",
        description: "Please fill in all fields for each vocabulary word.",
        variant: "destructive"
      });
      return;
    }

    // Here you would submit to the API
    toast({
      title: "Task Submitted Successfully!",
      description: `${words.length} vocabulary words submitted for today.`
    });

    // Reset form
    setWords([{ id: '1', word: '', meaning: '', sentence: '', description: '' }]);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Daily Tasks</h1>
            <p className="text-gray-600">Submit your vocabulary words for today</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{new Date().toLocaleDateString('id-ID', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Today's Vocabulary Submission</CardTitle>
                <CardDescription>
                  Submit 5 vocabulary words with their meanings, sample sentences, and descriptions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {words.map((word, index) => (
                  <div key={word.id} className="p-4 border border-gray-200 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Word #{index + 1}</h3>
                      {words.length > 1 && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => removeWord(word.id)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`word-${word.id}`}>Vocabulary Word</Label>
                        <Input
                          id={`word-${word.id}`}
                          value={word.word}
                          onChange={(e) => updateWord(word.id, 'word', e.target.value)}
                          placeholder="Enter the vocabulary word"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`meaning-${word.id}`}>Meaning</Label>
                        <Input
                          id={`meaning-${word.id}`}
                          value={word.meaning}
                          onChange={(e) => updateWord(word.id, 'meaning', e.target.value)}
                          placeholder="Enter the meaning"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor={`sentence-${word.id}`}>Sample Sentence</Label>
                      <Textarea
                        id={`sentence-${word.id}`}
                        value={word.sentence}
                        onChange={(e) => updateWord(word.id, 'sentence', e.target.value)}
                        placeholder="Write a sample sentence using this word"
                        rows={2}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`description-${word.id}`}>Description</Label>
                      <Textarea
                        id={`description-${word.id}`}
                        value={word.description}
                        onChange={(e) => updateWord(word.id, 'description', e.target.value)}
                        placeholder="Provide additional description or context"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between">
                  <Button 
                    variant="outline" 
                    onClick={addWord} 
                    disabled={words.length >= 5}
                    className="flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Word ({words.length}/5)</span>
                  </Button>
                  
                  <Button onClick={submitTask} className="bg-blue-600 hover:bg-blue-700">
                    Submit Today's Task
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Today's Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {words.filter(w => w.word.trim()).length}/5
                  </div>
                  <p className="text-sm text-gray-600">Words completed</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Submissions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium">Yesterday</p>
                    <p className="text-sm text-gray-600">5 words submitted</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <Star className="h-4 w-4 text-gray-300" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium">2 days ago</p>
                    <p className="text-sm text-gray-600">5 words submitted</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium">3 days ago</p>
                    <p className="text-sm text-red-600">No submission (+3 penalty)</p>
                  </div>
                  <div className="text-red-600 text-sm font-medium">
                    Missed
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
