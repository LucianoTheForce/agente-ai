import React from 'react';
import { Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { TaskResult } from './TaskResult';

type TaskStatus = 'pending' | 'processing' | 'completed' | 'failed';

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  timestamp: string;
  result?: string;
}

interface TaskListProps {
  tasks: Task[];
}

const getStatusIcon = (status: TaskStatus) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-5 w-5 text-gray-400" />;
    case 'processing':
      return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
    case 'completed':
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case 'failed':
      return <XCircle className="h-5 w-5 text-red-500" />;
  }
};

export function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">No tasks yet. Start by submitting a prompt above!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Tasks</h3>
      </div>
      <ul className="divide-y divide-gray-200">
        {tasks.map((task) => (
          <li key={task.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(task.status)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(task.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className={cn(
                'px-2.5 py-0.5 rounded-full text-xs font-medium',
                {
                  'bg-gray-100 text-gray-800': task.status === 'pending',
                  'bg-blue-100 text-blue-800': task.status === 'processing',
                  'bg-green-100 text-green-800': task.status === 'completed',
                  'bg-red-100 text-red-800': task.status === 'failed',
                }
              )}>
                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </div>
            </div>
            {task.result && (task.status === 'completed' || task.status === 'failed') && (
              <TaskResult result={task.result} status={task.status} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}