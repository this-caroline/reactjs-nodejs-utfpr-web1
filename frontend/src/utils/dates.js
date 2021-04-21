import { TIMES } from "./contants";

export const sortDates = (a, b, order) => {
  a = a.split('/').reverse().join('');
  b = b.split('/').reverse().join('');

  if (order === 'asc') return a > b ? 1 : a < b ? -1 : 0;
  return b > a ? 1 : a < b ? -1 : 0;
};

export const getTimes = () => TIMES.map((time) => ({
  label: time.split('').slice(0, 5).join(''),
  value: time.split('').slice(0, 5).join(''),
}));
