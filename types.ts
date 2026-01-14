export type ModelType = string;

export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: number;
  model?: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface ComposerProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  onStop: () => void;
  isLoading: boolean;
  isEmptyState?: boolean;
  model: ModelType;
}

export interface PollinationsModel {
  id: string;
  object: string;
  created: number;
  owned_by?: string;
  description?: string;
  name?: string;
  type?: 'text' | 'image';
}