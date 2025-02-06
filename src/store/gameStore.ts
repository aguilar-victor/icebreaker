import { create } from 'zustand';
import { User, Room, Answer, Question } from '../types/game';

interface GameState {
  currentUser: User | null;
  currentRoom: Room | null;
  questions: Question[];
  answers: Answer[];
  timeRemaining: number;
  setCurrentUser: (user: User | null) => void;
  setCurrentRoom: (room: Room | null) => void;
  setQuestions: (questions: Question[]) => void;
  addAnswer: (answer: Answer) => void;
  setTimeRemaining: (time: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentUser: null,
  currentRoom: null,
  questions: [],
  answers: [],
  timeRemaining: 60,
  setCurrentUser: (user) => set({ currentUser: user }),
  setCurrentRoom: (room) => set({ currentRoom: room }),
  setQuestions: (questions) => set({ questions }),
  addAnswer: (answer) => set((state) => ({ 
    answers: [...state.answers, answer] 
  })),
  setTimeRemaining: (time) => set({ timeRemaining: time }),
}));