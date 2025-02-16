import { AxiosRequestConfig } from 'axios';
import { QueryFunction } from '@tanstack/react-query';
import { customAxios } from '@/api';
import { Todo } from '@/models/todo';

export type TodoQueryKeyScroll = [
  string,
  string,
  { completed?: boolean; limit?: number; sort?: string; order?: string }
];

export type TodosResponse = {
  todos: Todo[];
  nextCursor: number | null;
  hasNextPage: boolean;
};

// QueryFunction<Tipe Response, Tipe QueryKey>
export const getScrollTodos: QueryFunction<
  TodosResponse,
  TodoQueryKeyScroll
> = async ({ queryKey, pageParam = 0, signal }) => {
  const [path, subpath, { completed, limit, sort, order }] = queryKey;

  const apiPath = `/${path}/${subpath}`;
  const axiosRequestConfig: AxiosRequestConfig = {
    signal,
    params: { completed, nextCursor: pageParam, limit, sort, order },
  };

  const response = await customAxios.get(apiPath, axiosRequestConfig);
  return response.data;
};
