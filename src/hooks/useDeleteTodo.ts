// src/hooks/todos/useDeleteTodo.ts

import { deleteTodo } from '@/api/todos/deleteTodo';
import { TodoQueryKeyScroll, TodosResponse } from '@/api/todos/getScrollTodos';
import { Todo } from '@/models/todo';
import {
  useMutation,
  useQueryClient,
  UseMutateAsyncFunction,
  InfiniteData,
} from '@tanstack/react-query';

type DeleteTodoVariables = {
  id: string;
  queryKey: TodoQueryKeyScroll;
};

type UseDeleteTodoReturn = {
  deleteTodo: UseMutateAsyncFunction<void | Todo, Error, DeleteTodoVariables>;
  isDeleting: boolean;
  error: Error | null;
  isDeleteSuccess: boolean;
};

export const useDeleteTodo = (): UseDeleteTodoReturn => {
  const queryClient = useQueryClient();

  const deleteTodoMutation = useMutation<
    void | Todo,
    Error,
    DeleteTodoVariables
  >({
    mutationFn: deleteTodo,

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: variables.queryKey });
    },
  });

  return {
    deleteTodo: deleteTodoMutation.mutateAsync,
    isDeleting: deleteTodoMutation.isPending,
    error: deleteTodoMutation.error,
    isDeleteSuccess: deleteTodoMutation.isSuccess,
  };
};

type MutationContext = {
  previousData: InfiniteData<TodosResponse> | undefined;
};

type OptimisticDeleteTodoVariables = {
  id: string;
  queryKey: TodoQueryKeyScroll;
};

type UseOptimisticDeleteTodoReturn = {
  deleteTodo: UseMutateAsyncFunction<
    void | Todo,
    Error,
    OptimisticDeleteTodoVariables,
    MutationContext
  >;
  isDeleting: boolean;
  error: Error | null;
  isDeleteSuccess: boolean;
};

export const useOptimisticDeleteTodo = (): UseOptimisticDeleteTodoReturn => {
  const queryClient = useQueryClient();

  const deleteTodoMutation = useMutation<
    void | Todo,
    Error,
    OptimisticDeleteTodoVariables,
    MutationContext
  >({
    mutationFn: deleteTodo,

    onMutate: async ({ id, queryKey }) => {
      await queryClient.cancelQueries({ queryKey });

      const previousData =
        queryClient.getQueryData<InfiniteData<TodosResponse>>(queryKey);

      if (previousData) {
        const updatedData = {
          ...previousData,
          pages: previousData.pages.map((page) => ({
            ...page,
            todos: page.todos.filter((todo) => todo.id !== id),
          })),
        };

        queryClient.setQueryData(queryKey, updatedData);
      }

      return { previousData };
    },

    onError: (_error, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(variables.queryKey, context.previousData);
      }
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: variables.queryKey });
    },
  });

  return {
    deleteTodo: deleteTodoMutation.mutateAsync,
    isDeleting: deleteTodoMutation.isPending,
    error: deleteTodoMutation.error,
    isDeleteSuccess: deleteTodoMutation.isSuccess,
  };
};
