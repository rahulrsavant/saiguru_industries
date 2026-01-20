import { STORAGE_KEYS, readNumber, readString, writeNumber, writeString } from './storage';

export const getIndiaDateDDMMYYYY = (date = new Date()) => {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const parts = formatter.formatToParts(date).reduce((acc, part) => {
    if (part.type !== 'literal') {
      acc[part.type] = part.value;
    }
    return acc;
  }, {});
  return `${parts.day}${parts.month}${parts.year}`;
};

export const getNextDailyCounter = () => {
  const today = getIndiaDateDDMMYYYY();
  const lastDate = readString(STORAGE_KEYS.lastCounterDate, '');
  let counter = readNumber(STORAGE_KEYS.counter, 0);
  if (lastDate !== today) {
    counter = 0;
  }
  counter += 1;
  writeString(STORAGE_KEYS.lastCounterDate, today);
  writeNumber(STORAGE_KEYS.counter, counter);
  return { date: today, counter };
};

export const buildEstimateNo = ({ prefix, date, counter, timestamp }) => {
  const paddedCounter = String(counter).padStart(5, '0');
  return `${prefix}${date}${timestamp}/${paddedCounter}`;
};
