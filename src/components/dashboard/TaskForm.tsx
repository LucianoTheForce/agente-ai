import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface TaskFormProps {
  onSubmit: (prompt: string) => Promise<void>;
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [prompt, setPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(prompt);
      setPrompt('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-lg font-medium text-gray-900 mb-2">
            Enter your image prompt
          </label>
          <p className="text-sm text-gray-500 mb-4">
            Describe the image you want to generate in detail. Be specific about style, mood, and elements.
          </p>
        </div>
        <div className="relative">
          <textarea
            id="prompt"
            rows={4}
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 resize-none"
            placeholder="E.g., A serene mountain landscape at sunset with snow-capped peaks and a crystal clear lake reflecting the orange sky..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !prompt.trim()}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Generating...
              </>
            ) : (
              <>
                <Send className="-ml-1 mr-2 h-5 w-5" />
                Generate Image
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}