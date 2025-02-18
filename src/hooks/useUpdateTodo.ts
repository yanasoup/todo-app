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
  isSuccess: boolean;
};

export const useOptimisticUpdateTodo = (): UseOptimisticUpdateTodoReturn => {
  const queryClient = useQueryClient();

  const updateTodoMutation = useMutation({
    mutationFn: optimisticUpdateTodo,

    onMutate: async ({ newTodo, queryKey }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData =
        queryClient.getQueryData<InfiniteData<TodosResponse>>(queryKey);

      if (previousData) {
        // const updatedData = {
        //   ...previousData,
        //   pages: previousData.pages.map((page) => {
        //     const oldTodosWithoutCurrentUpdatedTodo = page.todos.filter(
        //       (todo) => todo.id !== newTodo.id
        //     );

        //     return {
        //       ...page,
        //       todos: [newTodo, ...oldTodosWithoutCurrentUpdatedTodo],
        //     };
        //   }),
        // };

        // start: prevent todo to always rendered in 1st order in the list when edited
        const updatedItemIndex = previousData.pages[0].todos.findIndex(
          (todo) => todo.id === newTodo.id
        );
        let updatedItem = previousData.pages[0].todos[updatedItemIndex];
        updatedItem = { ...updatedItem, ...newTodo };

        const updatedData = previousData;
        updatedData.pages[0].todos[updatedItemIndex] = updatedItem;
        // end

        queryClient.setQueryData(queryKey, updatedData);
      }

      return { previousData, queryKey };
    },
    onError: (err, newTodo, context) => {
      if (context)
        queryClient.setQueryData(context.queryKey, context.previousData);
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: variables.queryKey });
    },
  });

  return {
    optimisticUpdateTodo: updateTodoMutation.mutate,
    isUpdating: updateTodoMutation.isPending,
    error: updateTodoMutation.error,
    isSuccess: updateTodoMutation.isSuccess,
  };
};
