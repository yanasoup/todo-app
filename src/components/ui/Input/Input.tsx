import React from 'react';
import styles from './Input.module.scss';
import clsx from 'clsx';
type InputProps = {
  type: 'text' | 'number';
  onChangeHandler?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  [key: string]: unknown;
};
export const Input: React.FC<InputProps> = ({
  type = 'text',
  onChangeHandler,
  className = '',
  ...rest
}) => {
  const cssClassess = clsx(styles.input, className);
  return (
    <>
      <input
        type={type}
        className={cssClassess}
        onChange={onChangeHandler}
        {...rest}
      />
    </>
  );
};
