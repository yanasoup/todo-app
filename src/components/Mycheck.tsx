import React, { useEffect, useState } from 'react';

export const Mycheck: React.FC<{ isDone: boolean }> = ({ isDone }) => {
  const [isCompleted, setIsCompleted] = useState(isDone);

  const handleChange = (completed: boolean) => {
    console.log('Mycheck handleChange', completed);
    setIsCompleted(completed);
  };

  useEffect(() => {
    setIsCompleted(isDone);
  }, [isDone]);

  useEffect(() => {
    console.log('Mycheck isCompleted', isCompleted);
  }, [isCompleted]);

  console.log('init isDone');
  return (
    <div>
      <input
        type='checkbox'
        checked={isCompleted}
        onChange={(e) => handleChange(e.target.checked)}
      />
    </div>
  );
};
