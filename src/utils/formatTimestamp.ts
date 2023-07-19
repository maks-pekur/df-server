import { format } from 'date-fns';

interface FirebaseTimestamp {
  _seconds: number;
  _nanoseconds?: number;
}

export const formatTimestamp = (timestamp: FirebaseTimestamp) => {
  const date = new Date(timestamp._seconds * 1000);
  const formattedDate = format(date, 'dd.MM.yyyy');
  const formattedTime = format(date, 'HH:mm');
  return { formattedDate, formattedTime };
};
