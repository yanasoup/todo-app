import { TodoQueryKeyScroll } from '@/api/todos/getScrollTodos';

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  date: Date;
};

export type NewTodo = {
  title: string;
  completed: boolean;
};

export type UpdateTodoParams = {
  id: string;
  title: string;
  completed: boolean;
};

export type OptimisticCreateTodoParams = {
  newTodo: Todo;
  queryKey: TodoQueryKeyScroll;
};
