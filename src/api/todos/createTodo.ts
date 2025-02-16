import { customAxios } from '@/api';
import { NewTodo, Todo, OptimisticCreateTodoParams } from '@/models/todo';
import { MutationFunction } from '@tanstack/react-query';

// MutationFunction<Tipe Response, Tipe Parameter>
export const createTodo: MutationFunction<Todo, NewTodo> = async (args) => {
  const response = await customAxios.post(`/todos`, args);
  return response.data;
};

export const createOptimisticTodo: MutationFunction<
  Todo | void,
  OptimisticCreateTodoParams
> = async (createParams) => {
  const response = await customAxios.post<Todo>('/todos', createParams.newTodo);
  return response.data;
};
