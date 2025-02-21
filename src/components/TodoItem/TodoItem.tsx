import React, { useState, useEffect } from 'react';
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
  const [isCompleted, setIsCompleted] = useState(item.completed);

  const handleChange = (completed: boolean) => {
    setIsCompleted(completed);
    onToggle(item.id, item.title, completed);
  };

  useEffect(() => {
    setIsCompleted(item.completed);
  }, [item.completed]);

  const titleClass = isCompleted
    ? clsx(styles.titleText, styles.completed)
    : clsx(styles.titleText);

  const liClass = isPending
    ? clsx(styles.todo, styles.isPending)
    : clsx(styles.todo);

  const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const formattedTime = new Date(item.date).toLocaleTimeString('en-US');

  return (
    <>
      <li className={liClass}>
        {isPending && (
          <div className={styles.loaderDiv}>
            <BeatLoader size={16} />
          </div>
        )}
        <div className={styles.todoCheck}>
          <input
            type='checkbox'
            className={styles.todoCheckbox}
            checked={isCompleted}
            onChange={(e) => handleChange(e.target.checked)}
          />
          <div className={styles.todoTitle} onClick={() => onEdit(item.id)}>
            <p className={styles.titleAndTime}>
              <span className={titleClass}>{item.title}</span>
              <span className={styles.completedDateTime}>
                {isCompleted &&
                  `task completed @${formattedDate} ${formattedTime}`}
              </span>
            </p>
          </div>
          {children}
        </div>

        {!isPending && (
          <TrashIcon
            data-id={item.id}
            className={styles.deleteIcon}
            onClick={onDelete}
          />
        )}
      </li>
    </>
  );
};
