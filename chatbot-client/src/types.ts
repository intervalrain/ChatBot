export interface DSM {
  id: number;
  name: string;
  generation: string;
  technology: string;
  category: string;
  platform: string;
  revisionVersion: string;
  customMark?: string;
}

export interface LoginModel {
  userName: string;
  password: string;
}

export interface TokenResponse {
  token: string;
}

export interface ChatRequest {
  userPrompt: string;
  systemPrompt?: string | null;
  metaDataFilter?: Record<string, string[] | null> | null;
  topK?: number;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}