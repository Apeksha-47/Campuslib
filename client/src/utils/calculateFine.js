import { differenceInDays } from 'date-fns';
import { FINE_PER_DAY } from './constants';

const GRACE = 2;

export const calculateFine = (dueDate) => {
  const days = differenceInDays(new Date(), new Date(dueDate));
  const overdue = days - GRACE;
  return overdue > 0 ? overdue * FINE_PER_DAY : 0;
};
