import { create } from 'zustand';

export interface Task {
  id: string;
  title: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  timestamp: string;
  result?: string;
}

interface TaskState {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  addTask: (task) => set((state) => ({ 
    tasks: [task, ...state.tasks] 
  })),
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map((task) =>
      task.id === id ? { ...task, ...updates } : task
    ),
  })),
}));