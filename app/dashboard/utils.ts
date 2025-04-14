import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateTimeOptions = (): string[] => {
  const times: string[] = [];
  for (let hour = 8; hour <= 18; hour++) {
    ['00', '30'].forEach((minute) => {
      const time = `${hour.toString().padStart(2, '0')}:${minute}`;
      times.push(time);
    });
  }
  return times;
};

