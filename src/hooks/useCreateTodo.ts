import { createTodo, createOptimisticTodo } from '@/api/todos/createTodo';
import { NewTodo, OptimisticCreateTodoParams } from '@/models/todo';

import {
  useMutation,
  useQueryClient,
  InfiniteData,
} from '@tanstack/react-query';
import { TodoQueryKeyScroll, TodosResponse } from '@/api/todos/getScrollTodos';

type UseCreateTodoReturn = {
  createTodo: (params: NewTodo) => void;
  isCreating: boolean;
  isSuccess: boolean;
  error: Error | null;
};

export const useCreateTodo = (): UseCreateTodoReturn => {
  const queryClient = useQueryClient();

  const createTodoMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  return {
    createTodo: createTodoMutation.mutate,
    isCreating: createTodoMutation.isPending,
    isSuccess: createTodoMutation.isSuccess,
    error: createTodoMutation.error,
  };
};

// ============= for optimistic UI ===============

export const useOptimisticUICreateTodo = (queryKey: TodoQueryKeyScroll) => {
  const queryClient = useQueryClient();

  const addTodoMutation = useMutation({
    mutationFn: createOptimisticTodo,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });

  return addTodoMutation;
};

// ============= for optimistic cache ================
type useOptimisticCreateTodoType = {
  mutate: (params: OptimisticCreateTodoParams) => void;
  isSuccess: boolean;
  error: Error | null;
  isPending: boolean;
};

export const useOptimisticCreateTodo = (): useOptimisticCreateTodoType => {
  const queryClient = useQueryClient();
  const addTodoMutation = useMutation({
    mutationFn: createOptimisticTodo,

    onMutate: async ({ newTodo, queryKey }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData =
        queryClient.getQueryData<InfiniteData<TodosResponse>>(queryKey);

      if (previousData) {
        const updatedData = {
          ...previousData,
          pages: previousData.pages.map((page) => ({
            ...page,
            todos: [newTodo, ...page.todos],
          })),
        };

        queryClient.setQueryData(queryKey, updatedData);
        // queryClient.setQueriesData({ queryKey: [queryKey[0],queryKey[1]] }, updatedData);
      }

      return { previousData, queryKey };
    },
    onError: (err, newTodo, context) => {
      if (context) {
        queryClient.setQueryData(context.queryKey, context.previousData);
      } else {
        console.log(err, newTodo);
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: variables.queryKey });
    },
  });

  return addTodoMutation;
};
