import { format, isAfter } from 'date-fns';

export const fmt = (date) => format(new Date(date), 'dd MMM yyyy');
export const isOverdue = (dueDate) => isAfter(new Date(), new Date(dueDate));
