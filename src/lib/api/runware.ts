import axios, { AxiosError } from 'axios';
import { Task } from '../../store/taskStore';

const API_KEY = import.meta.env.VITE_RUNWARE_API_KEY;
const API_URL = 'https://api.runware.ai/v1/image/inference';

interface RunwareResponse {
  data: Array<{
    taskType: string;
    taskUUID: string;
    imageUUID: string;
    imageURL?: string;
    error?: boolean;
    errorMessage?: string;
  }>;
}

export async function processTask(task: Task): Promise<string> {
  if (!API_KEY) {
    throw new Error('Runware API key is missing');
  }

  try {
    const response = await axios.post<RunwareResponse>(
      API_URL,
      [{
        taskType: 'imageInference',
        taskUUID: task.id,
        positivePrompt: task.title,
        model: 'runware:101@1',
        height: 1024,
        width: 1024,
        steps: 30,
        CFGScale: 7,
        outputType: 'URL',
        checkNSFW: true,
        numberResults: 1
      }],
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
          'Accept': 'application/json'
        },
        timeout: 60000 // 60 second timeout
      }
    );

    if (!response.data?.data?.length) {
      throw new Error('No response data received from Runware API');
    }

    const result = response.data.data[0];

    if (result.error || !result.imageURL) {
      throw new Error(result.errorMessage || 'Failed to generate image');
    }

    return result.imageURL;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      throw new Error(`API Error: ${errorMessage}`);
    }
    throw error;
  }
}