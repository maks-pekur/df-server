export const imageValidation = (mimeType: string): boolean => {
  return mimeType.startsWith('image/');
};
