import React, { createContext, useState } from 'react';
import { Todo } from '@/models/todo';

type TodoContextType = {
  editedTodo: Todo | null;
  setEditedTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
};

// const initialState:

export const TodoContext = createContext<TodoContextType | null>(null);

type TodoContextProviderProps = {
  children: React.ReactNode;
};

export const TodoContextProvider: React.FC<TodoContextProviderProps> = ({
  children,
}) => {
  const [editedTodo, setEditedTodo] = useState<Todo | null>(null);

  return (
    <TodoContext.Provider value={{ editedTodo, setEditedTodo }}>
      {children}
    </TodoContext.Provider>
  );
};
