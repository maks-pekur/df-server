import { addMinutes } from 'date-fns';

export const getExpiry = () => {
  const createdAt = new Date();
  const expiresAt = addMinutes(createdAt, 5);
  return expiresAt;
};
