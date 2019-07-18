export type MyTextInputMessage = {
  type: 'success' | 'error';
  text: string | string[];
} | null;
