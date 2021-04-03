import React from 'react';
import Pagination from '../Pagination';

import styles from './Table.module.css';

const Table = (props) => {
  const { children, className, hasPagination = false, ...rest } = props;

  return (
    <>
      <table className={`${styles.Table} ${className} table table-hover`} {...rest}>
        {children}
      </table>
      {hasPagination && (<Pagination pagination={{ page: 1, lastPage: 20 }} />)}
    </>
  );
};

export default Table;
