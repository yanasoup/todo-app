// src/hooks/todos/useGetTodos.ts

import { useQuery } from '@tanstack/react-query';
import { getTodos } from '@/api/todos/getTodos';
import { Todo } from '@/models/todo';

export type TodoQueryKey = [
  string,
  {
    completed?: boolean;
    limit?: number;
    page: number;
    sort?: string;
    order?: string;
  }
];

type UseGetTodosParams = {
  completed?: boolean;
  limit?: number;
  page?: number;
  sort?: string;
  order?: string;
};

type UseGetTodosReturn = {
  todos: Todo[];
  totalTodos: number;
  hasNextPage: boolean;
  nextPage: number | null;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  queryKey: TodoQueryKey;
};

export const useGetTodos = ({
  completed,
  limit = 10,
  page = 1,
  sort = 'date',
  order = 'desc',
}: UseGetTodosParams = {}): UseGetTodosReturn => {
  const queryKey: TodoQueryKey = [
    'todos',
    { completed, limit, page, sort, order },
  ];
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: queryKey,
    queryFn: getTodos,
  });

  const todos = data?.todos ?? [];
  const totalTodos = data?.totalTodos ?? 0;
  const hasNextPage = data?.hasNextPage ?? false;
  const nextPage = data?.nextPage ?? null;

  return {
    todos,
    totalTodos,
    hasNextPage,
    nextPage,
    isLoading,
    isFetching,
    error,
    queryKey,
  };
};
