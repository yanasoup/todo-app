import { customAxios } from '@/api';
import { Todo } from '@/models/todo';
import { MutationFunction } from '@tanstack/react-query';

type DeleteTodoParams = {
  id: string;
};

export const deleteTodo: MutationFunction<
  Todo | void,
  DeleteTodoParams
> = async ({ id }) => {
  const response = await customAxios.delete(`/todos/${id}`);
  return response.data;
};
