// src/hooks/todos/useUpdateTodo.ts

import { updateTodo, optimisticUpdateTodo } from '@/api/todos/updateTodo';
import { UpdateTodoParams, OptimisticCreateTodoParams } from '@/models/todo';

import {
  useMutation,
  useQueryClient,
  InfiniteData,
} from '@tanstack/react-query';
import { TodosResponse, TodoQueryKeyScroll } from '@/api/todos/getScrollTodos';

type UseUpdateTodoReturn = {
  updateTodo: (todo: UpdateTodoParams) => void;
  isUpdating: boolean;
  error: Error | null;
};

export const useUpdateTodo = (): UseUpdateTodoReturn => {
  const queryClient = useQueryClient();

  const updateTodoMutation = useMutation({
    mutationFn: ({
      id,
      title,
      completed,
    }: {
      id: string;
      title: string;
      completed: boolean;
    }) => updateTodo({ id, title, completed }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  return {
    updateTodo: updateTodoMutation.mutate,
    isUpdating: updateTodoMutation.isPending,
    error: updateTodoMutation.error,
  };
};

export const useOptimisticUIUpdateTodo = (queryKey: TodoQueryKeyScroll) => {
  const queryClient = useQueryClient();

  const updateTodoMutation = useMutation({
    mutationFn: ({
      id,
      title,
      completed,
    }: {
      id: string;
      title: string;
      completed: boolean;
    }) => updateTodo({ id, title, completed }),

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });

  return updateTodoMutation;
};

type UseOptimisticUpdateTodoReturn = {
  optimisticUpdateTodo: (params: OptimisticCreateTodoParams) => void;
  isUpdating: boolean;
  error: Error | null;
};

export const useOptimisticUpdateTodo = (): UseOptimisticUpdateTodoReturn => {
  const queryClient = useQueryClient();

  const updateTodoMutation = useMutation({
    mutationFn: optimisticUpdateTodo,

    onMutate: async ({ newTodo, queryKey }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData =
        queryClient.getQueryData<InfiniteData<TodosResponse>>(queryKey);
      // console.log('useOptimisticUpdateTodo previousData', previousData);

      if (previousData) {
        // Optimistically update the cache by removing the deleted item
        const updatedData = {
          ...previousData,
          pages: previousData.pages.map((page) => {
            const oldTodosWithoutCurrentUpdatedTodo = page.todos.filter(
              (todo) => todo.id !== newTodo.id
            );

            return {
              ...page,
              todos: [newTodo, ...oldTodosWithoutCurrentUpdatedTodo],
            };
          }),
        };

        queryClient.setQueryData(queryKey, updatedData);
      }

      // if (previousData) {
      //   const updatedData = {
      //     ...previousData,
      //     pages: previousData.pages.map((page) => ({
      //       ...page,
      //       todos: [newTodo, ...page.todos],
      //     })),
      //   };

      //   queryClient.setQueryData(queryKey, updatedData);
      // }

      // Return a context object with the snapshotted value
      return { previousData, queryKey };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      if (context)
        queryClient.setQueryData(context.queryKey, context.previousData);
    },
    // Always refetch after error or success:
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: variables.queryKey });
    },
  });

  return {
    optimisticUpdateTodo: updateTodoMutation.mutate,
    isUpdating: updateTodoMutation.isPending,
    error: updateTodoMutation.error,
  };
};
