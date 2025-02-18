import React, {
  useState,
  FormEvent,
  MouseEvent,
  useEffect,
  useContext,
} from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import styles from './TodoList.module.scss';
import { PuffLoader } from 'react-spinners';
import { Todo } from '@/models/todo';

import { useScrollTodos } from '@/hooks/useScrollTodos';
import { useOptimisticCreateTodo } from '@/hooks/useCreateTodo';
import { useOptimisticDeleteTodo } from '@/hooks/useDeleteTodo';
import { TodoItem } from '@/components/TodoItem/TodoItem';
import { OptimisticCreateTodoParams } from '@/models/todo';
import { useOptimisticUpdateTodo } from '@/hooks/useUpdateTodo';

import Modal from '@/components/Modal/Modal';
import { v4 as uuid } from 'uuid';

import { useIntersectionObserver } from '@/hooks/general/useIntersectionObserver';
import { TodoContext } from '@/context/TodoContext';

export const TodoList: React.FC = () => {
  const [newTodoText, setNewTodoText] = useState('');
  const [mutationMessage, setMutationMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [disabledInput, setDisabledInput] = useState(false);
  // const [editedTodo, setEditedTodo] = useState<Todo>();

  const {
    todos,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    queryKey,
  } = useScrollTodos({ limit: 20, sort: 'date', order: 'desc' });
  const addTodoMutation = useOptimisticCreateTodo();
  const { deleteTodo } = useOptimisticDeleteTodo();
  const { optimisticUpdateTodo, isUpdating } = useOptimisticUpdateTodo();

  useEffect(() => {
    setDisabledInput(addTodoMutation.isPending || isUpdating ? true : false);

    let timeoutId: NodeJS.Timeout;

    if (mutationMessage) {
      timeoutId = setTimeout(() => {
        setMutationMessage('');
      }, 2000);
    }

    return () => clearTimeout(timeoutId);
  }, [
    mutationMessage,
    setMutationMessage,
    addTodoMutation.isPending,
    isUpdating,
  ]);
  const observerRef = useIntersectionObserver(() => {
    if (hasNextPage) fetchNextPage();
  });

  const context = useContext(TodoContext);
  if (!context) {
    return <div>Error: TodoContext not found</div>;
  }
  const { editedTodo, setEditedTodo } = context;

  const handleAddTodo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const variables: OptimisticCreateTodoParams = {
      newTodo: {
        id: uuid(),
        title: newTodoText,
        completed: false,
        date: new Date(),
      },
      queryKey,
    };

    if (newTodoText.trim() != '') {
      addTodoMutation.mutate(variables);
      setEditedTodo(variables.newTodo);
      setNewTodoText('');
      setMutationMessage('Task created successfully!');
    }
  };

  const handleDeleteTodo = (e: MouseEvent<SVGElement>) => {
    const id = e.currentTarget.dataset.id;

    if (id) {
      deleteTodo({ id, queryKey });
      setMutationMessage('Task deleted successfully!');
    }
  };

  const handleStartEditTodo = (id: string) => {
    if (id) {
      const todoEdit = todos.filter((todo) => todo.id === id);
      if (todoEdit.length == 0) {
        return;
      }
      setEditedTodo(todoEdit[0] as Todo);
      setIsEditing(true);
    }
  };
  const handleFinishEditTodo = (updatedTodo: Todo) => {
    setIsEditing(false);
    const variables: OptimisticCreateTodoParams = {
      newTodo: updatedTodo,
      queryKey,
    };

    optimisticUpdateTodo(variables);
    setMutationMessage('Task updated successfully!');
  };

  const handleToggleTodo = (id: string, title: string, completed: boolean) => {
    const updatedTodo = { id, title, completed, date: new Date() };
    const variables: OptimisticCreateTodoParams = {
      newTodo: updatedTodo,
      queryKey,
    };
    setEditedTodo(updatedTodo);
    optimisticUpdateTodo(variables);
    setMutationMessage(
      `Task ${title} marked as ${completed ? 'completed' : 'incomplete'}`
    );
  };

  const handleCloseDialog = () => {
    setIsEditing(false);
  };

  return (
    <>
      <Modal
        onDialogClose={handleCloseDialog}
        todoItem={editedTodo}
        isOpen={isEditing}
        onConfirm={handleFinishEditTodo}
      />
      <div className={styles.flashMessageContainer}>
        {mutationMessage ? (
          <p className={styles.flashMessage}>{mutationMessage || ''}</p>
        ) : null}
      </div>
      <div className={styles.mainContainer}>
        <h1 className={styles.pageTitle}>Let’s Get Things Done!</h1>
        <p className={styles.pageSubTitle}>One Step Closer to Your Goals</p>
        <div className={styles.todoContainer}>
          <form className={styles.inputContainer} onSubmit={handleAddTodo}>
            <Input
              className={styles.todoInput}
              type='text'
              placeholder='Create new task'
              onChangeHandler={(e) => setNewTodoText(e.target.value)}
              value={newTodoText}
              disabled={disabledInput}
            />
            <Button color='primaryPurple' disabled={disabledInput}>
              Add
            </Button>
          </form>
          <div className={styles.listContainer}>
            <ul className={styles.todoLists}>
              {todos.map((todo, idx) => {
                const isTodoPending =
                  // idx === 0 && (addTodoMutation.isPending || isUpdating)
                  todo.id === editedTodo?.id &&
                  (addTodoMutation.isPending || isUpdating)
                    ? true
                    : false;
                return (
                  <TodoItem
                    key={idx}
                    item={todo}
                    onDelete={handleDeleteTodo}
                    onEdit={() => handleStartEditTodo(todo.id)}
                    onToggle={handleToggleTodo}
                    isPending={isTodoPending}
                  />
                );
              })}
            </ul>

            <div ref={observerRef} className={styles.observer}>
              {isFetchingNextPage && (
                <PuffLoader color='#8e44ad' size={40}>
                  <p>Loading more todos...</p>
                </PuffLoader>
              )}
            </div>
            {isLoading && <PuffLoader color='#8e44ad' size={40} />}
            {error && <p>Error loading todos: {error.message}</p>}
          </div>
        </div>
      </div>
    </>
  );
};
