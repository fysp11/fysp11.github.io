import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getSorter = <T extends {}>(...keys: Array<keyof T>) => {
  return (a: T, b: T) => {
    let counter = 0;
    for (const key of keys) {
      if (a[key] < b[key]) counter++;
      if (a[key] > b[key]) counter--;
    }
    return counter;
  };
};
