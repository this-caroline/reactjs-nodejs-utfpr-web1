import React from 'react';

import styles from './Table.module.css';

const Table = (props) => {
  const { children, className, ...rest } = props;

  return (
    <table className={`${styles.Table} ${className} table table-hover`} {...rest}>
      {children}
    </table>
  );
};

export default Table;
