import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRoomCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export const categories = [
  'Fun Facts',
  'Would You Rather',
  'Personal Preferences',
  'Childhood Memories',
  'Future Dreams'
];
