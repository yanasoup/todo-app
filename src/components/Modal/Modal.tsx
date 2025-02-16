import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.scss';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Todo } from '@/models/todo';
import IconClose from '@/assets/svg/icon-close.svg';

const Modal: React.FC<{
  children?: React.ReactNode;
  onDialogClose?: () => void;
  todoItem: Todo | undefined;
  isOpen: boolean;
  onConfirm: (data: Todo) => void;
}> = ({ children, onDialogClose, todoItem, isOpen, onConfirm }) => {
  const portalElement = document.getElementById('portal');
  const [newTodoText, setNewTodoText] = React.useState('');

  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      if (isOpen) {
        setNewTodoText(todoItem?.title ?? '');
        dialog.showModal();
      } else {
        setNewTodoText('');
        dialog.close();
      }
    }
  }, [isOpen]);

  if (!portalElement) {
    throw new Error('Portal element not found');
  }

  const confirmHandler = () => {
    const updatedTodo = { ...todoItem, title: newTodoText, date: new Date() };
    onConfirm(updatedTodo as Todo);
  };
  return createPortal(
    <dialog
      className={styles.todoDialog}
      ref={dialogRef}
      onClose={onDialogClose}
    >
      <IconClose className={styles.closeIcon} onClick={onDialogClose} />
      <h2>Edit Task</h2>
      <Input
        className={styles.todoInput}
        type='text'
        placeholder='Create new task'
        onChangeHandler={(e) => setNewTodoText(e.target.value)}
        value={newTodoText}
        onKeyPress={(e: React.KeyboardEvent) =>
          e.key === 'Enter' && confirmHandler()
        }
      />
      {children}
      <form method='dialog'>
        <Button color='primaryPurple' onClick={confirmHandler}>
          Save
        </Button>
      </form>
    </dialog>,
    portalElement // Target DOM di luar root utama
  );
};

export default Modal;
