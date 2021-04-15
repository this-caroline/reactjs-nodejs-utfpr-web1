import React, { useState } from 'react';
import { ChevronsLeft, ChevronsRight } from 'react-feather';

import styles from './Pagination.module.css';

const getPagesBar = (recordsLength, maxPagesPerBar, recordsPerPage) => {
  const pageBars = [];
  let accItems = [];
  let counter = 0;
  const totalPages = Math.ceil(recordsLength / recordsPerPage);

  [...Array(totalPages + 1).keys()].filter((i) => i).forEach((page, i) => {
    if (counter === maxPagesPerBar) {
      counter = 0;
      pageBars.push(accItems);
      accItems = [];
    }

    counter++;
    accItems.push(page);
  });
  pageBars.push(accItems);

  return pageBars;
}

const Pagination = (props) => {
  const {
    recordsLength,
    recordsPerPage = 5,
    maxPagesPerBar = 5,
    onPageChange,
    setIdxStart,
    currentPage,
    setCurrentPage,
  } = props;
  const pageBars = getPagesBar(recordsLength, maxPagesPerBar, recordsPerPage);
  const [currentPageBar, setCurrentPageBar] = useState(0);

  if (pageBars[0].length <= 1) {
    return null;
  }

  return (
    <div className={styles.Bar}>
      {currentPageBar > 0 && (
        <span
          className={`${styles.PageBox} ${styles.Chevron}`}
          onClick={() => setCurrentPageBar((prev) => prev - 1)}
        >
          <ChevronsLeft />
        </span>
      )}
      {pageBars[currentPageBar].map((item) => {
          return (
            <span
              onClick={() => {
                setCurrentPage(item);
                if (onPageChange) onPageChange();
                setIdxStart((recordsPerPage * item) - (recordsPerPage - 1));
              }}
              className={`${styles.PageBox} ${
                currentPage?.toString() === item?.toString()
                  ? styles.Active
                  : ''
                }
              `}
              key={item}
            >
              {item}
            </span>
          );
        })
      }
      {pageBars?.length > 1 && currentPageBar !== pageBars?.length - 1 && (
        <span
          className={`${styles.PageBox} ${styles.Chevron}`}
          onClick={() => setCurrentPageBar((prev) => prev + 1)}
        >
          <ChevronsRight />
        </span>
      )}
    </div>
  );
};

export default Pagination;
