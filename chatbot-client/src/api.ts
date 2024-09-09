import axios, { AxiosInstance, AxiosProgressEvent } from "axios";
import { BASE_URL } from "./Config";
import { DSM, LoginModel, TokenResponse, Message } from "./types";

const anonymousApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// intercept authenticated api
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); 
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const login = async (loginModel: LoginModel): Promise<TokenResponse> => {
  try {
    const response = await anonymousApi.post<TokenResponse>('/Auth/login', loginModel);
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const getDocuments = async (): Promise<DSM[]> => {
  try {
    const response = await api.get<DSM[]>('/Document/getDocuments');
    return response.data;
  } catch (error) {
    console.error('Get documents error:', error);
    throw error;
  }
};

export const chatCompletion = async (messages: Message[], onChunk: (chunk: string) => void) => {
  let streamedText = '';

  try {
    await api.post('/ChatBot/completions', {
      model: 'gpt-3.5-turbo',
      messages,
      stream: true
    }, {
      responseType: 'text',
      headers: {
        'Accept': 'text/event-stream'
      },
      onDownloadProgress: (progressEvent: AxiosProgressEvent) => {
        const data = progressEvent.event.target as XMLHttpRequest;
        if (data.responseText) {
          const newText = data.responseText.slice(streamedText.length);
          streamedText = data.responseText;
          
          const lines = newText.split('\n');
          const parsedLines = lines
            .map(line => line.replace(/^data: /, '').trim())
            .filter(line => line !== '' && line !== '[DONE]')
            .map(line => {
              try {
                return JSON.parse(line);
              } catch (e) {
                console.error('Error parsing line:', line);
                return null;
              }
            })
            .filter(line => line !== null);

          for (const parsed of parsedLines) {
            const content = parsed.choices[0]?.delta?.content || '';
            if (content) {
              onChunk(content);
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Error in chatCompletion:', error);
    throw error;
  }
};