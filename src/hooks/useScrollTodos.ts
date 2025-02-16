import { useInfiniteQuery } from '@tanstack/react-query';
import { getScrollTodos, TodoQueryKeyScroll } from '@/api/todos/getScrollTodos';

type UseGetTodosParams = {
  completed?: boolean;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
};

export const useScrollTodos = ({
  completed,
  limit,
  sort,
  order,
}: UseGetTodosParams = {}) => {
  const queryKey: TodoQueryKeyScroll = [
    'todos',
    'scroll',
    { completed, limit, sort, order },
  ];

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    isSuccess,
    isFetching,
  } = useInfiniteQuery({
    queryKey,
    queryFn: getScrollTodos,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  const todos = data?.pages.flatMap((page) => page.todos) ?? [];

  return {
    todos,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    isSuccess,
    isFetching,
    queryKey,
  };
};
