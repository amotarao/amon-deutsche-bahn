import { NextApiRequest } from 'next';

export const stringifyQuery = (query: NextApiRequest['query'], key: string, required = false): string => {
  if (!(key in query)) {
    if (required) {
      throw new Error(`${key} query is missing.`);
    }
    return '';
  }

  const value = query[key];
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};

export const arrayQuery = (query: NextApiRequest['query'], key: string, required = false): string[] => {
  if (key in query) {
    if (required) {
      throw new Error(`${key} query is missing.`);
    }
    return [];
  }

  const value = query[key];
  if (Array.isArray(value)) {
    return value;
  }
  return [value];
};

export const formatDate = (date: string): string => {
  return [date.slice(8, 10), date.slice(5, 7), date.slice(0, 4)].join('.');
};
