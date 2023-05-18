export interface ChatResponse {
  choices: Choice[];
  created: number;
  id: string;
  object: string;
  usage: Usage;
}

interface Choice {
  finish_reason?: string;
  index?: number;
  message?: ChatMessage;
}

export interface ChatMessage {
  role: string;
  content: string;
}

interface Usage {
  completion_tokens: number;
  prompt_tokens: number;
  total_tokens: number;
}

interface StreamChoice {
  finish_reason?: string;
  index?: number;
  delta: {
    role?: 'assistant';
    content?: string;
  };
}

export interface ChatStreamData {
  choices: StreamChoice[];
  created: number;
  id: string;
  object: string;
  model: string;
}
