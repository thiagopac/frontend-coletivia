export interface ChatMessagesResponse {
  uuid: string;
  type: string;
  title: string;
  behavior: Behavior;
  messages: Messages;
  created_at: string;
  updated_at: string;
  model: Model;
}

export interface Behavior {
  stream: boolean;
  messages: Message[];
  logit_bias: LogitBias;
  temperature: number;
  presence_penalty: number;
  frequency_penalty: number;
}

export interface Message {
  role: string;
  content: string;
}

export interface LogitBias {}

export interface Messages {
  messages: Message2[];
}

export interface Message2 {
  role: string;
  content: string;
}

export interface Model {
  uuid: string;
  name: string;
  release: string;
  type: string;
  is_available: number;
  created_at: string;
  updated_at: string;
}
