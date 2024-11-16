import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useTaskStore } from '../../store/taskStore';
import { TaskForm } from './TaskForm';
import { TaskList } from './TaskList';
import { LogOut } from 'lucide-react';
import { processTask } from '../../lib/api/runware';

export function Dashboard() {
  const { user, signOut } = useAuthStore();
  const { tasks, addTask, updateTask } = useTaskStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTaskSubmit = async (prompt: string) => {
    if (isProcessing) return;

    const taskId = crypto.randomUUID();
    const newTask = {
      id: taskId,
      title: prompt,
      status: 'processing' as const,
      timestamp: new Date().toISOString(),
    };

    setIsProcessing(true);
    addTask(newTask);

    try {
      const result = await processTask(newTask);
      if (!result) {
        throw new Error('No image URL received');
      }
      updateTask(taskId, {
        status: 'completed',
        result,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process task';
      console.error('Task processing failed:', errorMessage);
      updateTask(taskId, {
        status: 'failed',
        result: errorMessage,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">AI Image Generator</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">{user?.email}</span>
              <button
                onClick={() => signOut()}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-6">
          <TaskForm onSubmit={handleTaskSubmit} />
          <TaskList tasks={tasks} />
        </div>
      </main>
    </div>
  );
}