import { customAxios } from '@/api';
import {
  Todo,
  UpdateTodoParams,
  OptimisticCreateTodoParams,
} from '@/models/todo';
import { MutationFunction } from '@tanstack/react-query';

// export const updateTodo: MutationFunction<Todo | void, Todo> = async ({
export const updateTodo: MutationFunction<
  Todo | void,
  UpdateTodoParams
> = async ({ id, title, completed }) => {
  const response = await customAxios.put(`/todos/${id}`, {
    title,
    completed,
    date: new Date(),
  });
  return response.data;
};

export const optimisticUpdateTodo: MutationFunction<
  UpdateTodoParams | void,
  OptimisticCreateTodoParams
> = async ({ newTodo }) => {
  const response = await customAxios.put(`/todos/${newTodo.id}`, newTodo);
  return response.data;
};
