import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { customAxios } from '@/api';
import { AxiosRequestConfig } from 'axios';
import { Todo } from '@/models/todo';
import styles from './InfiniteScroll.module.scss';
import { useInView } from 'react-intersection-observer';

export const InfiniteScroll: React.FC = () => {
  const fetchTodos = async ({ pageParam }) => {
    const axiosRequestConfig: AxiosRequestConfig = {
      params: {
        nextCursor: pageParam,
        limit: 25,
        sort: 'date',
        order: 'desc',
      },
    };

    const response = await customAxios.get('todos/scroll', axiosRequestConfig);
    return response.data;
  };

  const { ref: lastElementRef, inView } = useInView();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['projects'],
    queryFn: fetchTodos,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    // getPreviousPageParam: (firstPage) => firstPage.previousId,
    // getNextPageParam: (lastPage) => lastPage.nextId,
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  return status === 'pending' ? (
    <p>Loading...</p>
  ) : status === 'error' ? (
    <p>Error: {error.message}</p>
  ) : (
    <>
      <ul className={styles.todoList}>
        {data.pages.map((group, i) => (
          <React.Fragment key={i}>
            {group.todos.map((todo: Todo) => (
              <li className={styles.todoItem} key={todo.id}>
                {todo.title}
              </li>
            ))}
          </React.Fragment>
        ))}
      </ul>
      <div>
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? 'Loading more...'
            : hasNextPage
            ? 'Load More'
            : 'Nothing more to load'}
        </button>
      </div>
      <div ref={lastElementRef}>
        {isFetching && !isFetchingNextPage ? 'Fetching...' : null}
      </div>
    </>
  );
};
