import React, { useState } from 'react';
import { Todo } from '@/models/todo';
import TrashIcon from '@/assets/svg/icon-trash.svg';
import styles from './TodoItem.module.scss';
import clsx from 'clsx';
import { BeatLoader } from 'react-spinners';

type TodoItemProps = {
  item: Todo;
  onDelete: (event: React.MouseEvent<SVGElement>) => void;
  onEdit: (id: string) => void;
  onToggle: (id: string, title: string, completed: boolean) => void;
  children?: React.ReactNode;
  isPending?: boolean;
};
export const TodoItem: React.FC<TodoItemProps> = ({
  item,
  onDelete,
  onEdit,
  onToggle,
  children,
  isPending = false,
}) => {
  const [isCompleted, setIsCompleted] = useState(item?.completed || false);

  const handleCheck = (id: string, title: string, completed: boolean) => {
    setIsCompleted(!isCompleted);
    onToggle(id, title, completed);
  };

  const titleClass = isCompleted
    ? clsx(styles.todoTitle, styles.completed)
    : clsx(styles.todoTitle);

  const liClass = isPending
    ? clsx(styles.todo, styles.isPending)
    : clsx(styles.todo);

  return (
    <>
      <li className={liClass}>
        <div className={styles.todoCheck}>
          <input
            type='checkbox'
            className={styles.todoCheckbox}
            onClick={() => handleCheck(item.id, item.title, item.completed)}
            checked={isCompleted}
            onChange={(e) => setIsCompleted(e.target.checked)}
          />
          <p className={titleClass} onClick={() => onEdit(item.id)}>
            <span>{item.title}</span>
            {isPending && <BeatLoader size={16} />}
          </p>
          {children}
        </div>
        <TrashIcon
          data-id={item.id}
          className={styles.deleteIcon}
          onClick={onDelete}
        />
      </li>
    </>
  );
};
