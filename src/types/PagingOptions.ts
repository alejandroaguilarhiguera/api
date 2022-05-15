export interface PagingOptions<M = { [key: string]: unknown }> {
  limit: number;
  order: [keyof M, 'asc' | 'ASC' | 'desc' | 'DESC'][];
}
