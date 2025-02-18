import React from 'react';
import { TodoList } from '@/components/TodoList/TodoList';
import { TodoContextProvider } from './context/TodoContext';
const App: React.FC = () => {
  return (
    <>
      <TodoContextProvider>
        <TodoList />
      </TodoContextProvider>
    </>
  );
};

export default App;
