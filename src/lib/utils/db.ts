import { Between, LessThanOrEqual, MoreThan } from 'typeorm';

export const queryDbByDateFilter = (
  query: { from?: string; to?: string },
  dateField: string = 'createdAt',
) => {
  const to = query.to ? new Date(query.to) : query.to;
  const from = query.from ? new Date(query.from) : query.from;

  if (to && !from) return { [dateField]: LessThanOrEqual(to) };
  if (!to && from) return { [dateField]: MoreThan(from) };
  if (to && from) return { [dateField]: Between(from, to) };

  return {};
};
