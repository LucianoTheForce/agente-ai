import React from 'react';
import { Download } from 'lucide-react';

interface TaskResultProps {
  result: string;
  status: 'completed' | 'failed';
}

export function TaskResult({ result, status }: TaskResultProps) {
  if (status === 'failed') {
    return (
      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-600">{result}</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <img 
        src={result} 
        alt="Generated image" 
        className="rounded-lg shadow-lg max-w-full h-auto"
        loading="lazy"
      />
      <div className="mt-2 flex justify-end">
        <a 
          href={result}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-1.5 text-sm text-indigo-600 hover:text-indigo-700"
        >
          <Download className="h-4 w-4 mr-1" />
          Download Image
        </a>
      </div>
    </div>
  );
}