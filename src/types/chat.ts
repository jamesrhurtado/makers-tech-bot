export interface Message {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: Date;
}