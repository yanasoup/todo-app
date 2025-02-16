import { AxiosRequestConfig } from 'axios';
import { QueryFunction } from '@tanstack/react-query';
import { customAxios } from '@/api';
import { Todo } from '@/models/todo';

type TodoQueryKey = [
  string,
  {
    completed?: boolean;
    page?: number;
    limit?: number;
    sort?: string;
    order?: string;
  }
];

type TodosResponse = {
  todos: Todo[];
  totalTodos: number;
  hasNextPage: boolean;
  nextPage: number | null;
};

export const getTodos: QueryFunction<TodosResponse, TodoQueryKey> = async ({
  queryKey,
  signal,
}) => {
  const [path, { completed, page = 1, limit = 10, sort, order }] = queryKey;

  const apiPath = `/${path}`;
  const axiosRequestConfig: AxiosRequestConfig = {
    signal,
    params: { completed, page, limit, sort, order },
  };

  const response = await customAxios.get<TodosResponse>(
    apiPath,
    axiosRequestConfig
  );
  return response.data;
};
