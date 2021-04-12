import React from 'react';

import styles from './Pagination.module.css';

const Pagination = ({ pagination }) => {
  const previousPage = Math.ceil((pagination.page - 5) / 5) * 5;
  const maxPerPaginationBar = 5;
  let lastPagePaginationBar = 5;
  let pagingBarSize = maxPerPaginationBar;

  const getLastPageOfPaginationBar = () => {
    if (pagination.page % maxPerPaginationBar === 0) return pagination.page;
    if (pagination.page === lastPagePaginationBar) return pagination.page;
    
    lastPagePaginationBar = pagination.page + 
    (maxPerPaginationBar - (pagination.page % maxPerPaginationBar));

    return lastPagePaginationBar;
  };

  if (pagination.lastPage % maxPerPaginationBar === 0 ||
    pagination.lastPage === maxPerPaginationBar
  ) {
    pagingBarSize = 5;
  } else if (getLastPageOfPaginationBar() >= pagination.lastPage) {
      pagingBarSize = pagination.lastPage % maxPerPaginationBar;
    }

  const setPage = (_, page) => {
    if (page === pagination.page) return false;

    console.log('ola')
    // fetch data here...
  };

  const getNextPage = () => {
    if (pagination.page < maxPerPaginationBar) return maxPerPaginationBar + 1;
    if (pagination.page % maxPerPaginationBar === 0) return pagination.page + 1;
    else return getLastPageOfPaginationBar() + 1;
  }

  return (
    <div className={styles.Container}>
      {pagination.page > 5 && (
        <span
          className={styles.Page}
          onClick={(evt) => setPage(evt, previousPage)}
        >
          &lt;
        </span>
      )}

      {Array.from(Array(pagingBarSize)).map((pg, i) => {
        const page = i + (previousPage) + 1;

        return (
          <span
            key={page}
            onClick={(evt) => setPage(evt, page)}
            className={`
              ${styles.Page}
              ${pagination.page === page ? styles.Active : ''}
            `}
          >
            {page}
          </span>
        );
      })}

      {pagination.lastPage > maxPerPaginationBar &&
        pagingBarSize === maxPerPaginationBar &&
        getLastPageOfPaginationBar() !== pagination.lastPage && (
          <span
            className={styles.Page}
            onClick={(evt) => setPage(evt, getNextPage())}
          >
            &gt;
          </span>
        )
      }
    </div>
  );
};

export default Pagination;
