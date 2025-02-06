export interface User {
  id: string;
  username: string;
  isGuest: boolean;
}

export interface Room {
  id: string;
  hostId: string;
  guestId?: string;
  status: 'waiting' | 'answering' | 'discussing' | 'completed';
  currentQuestionIndex: number;
  startTime?: number;
}

export interface Answer {
  userId: string;
  questionId: number;
  answer: boolean;
  timestamp: number;
}

export interface Question {
  id: number;
  text: string;
  category: 'personal' | 'professional' | 'fun';
}