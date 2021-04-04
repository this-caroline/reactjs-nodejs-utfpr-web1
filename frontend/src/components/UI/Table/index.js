import React, { createRef } from 'react';
import { Button, Col, Input, Row } from 'reactstrap';
import { Plus } from 'react-feather';

import styles from './Table.module.css';
import Pagination from '../Pagination';

const flattenObject = function(ob) {
  var toReturn = {};
  
  for (var i in ob) {
    if (!ob.hasOwnProperty(i) || i.toString().toLocaleLowerCase() === 'actions') {
      continue;
    }
    
    if ((typeof ob[i]) == 'object') {
      var flatObject = flattenObject(ob[i]);
      for (var x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;
        
        toReturn[x] = flatObject[x];
        // toReturn[i + '.' + x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }

  return toReturn;
};

const Table = (props) => {
  let timer = null;
  const tableRef = createRef();
  const {
    children,
    className,
    tableInfo,
    tableData = [],
    columns = [],
    hasPagination = false,
    ...rest
  } = props;

  return (
    <>
      {tableInfo?.visible && (
        <>
          <Row className="mr-2">
            <Col>
              <h3 style={{ color: '#515151' }} className="font-weight-bold h5 mb-1">
                {tableInfo?.title}
              </h3>
              <p className="text-muted">{tableInfo?.message}</p>
            </Col>
          </Row>
          {tableInfo?.addButton?.visible && (
            <Button
              className="mb-3 width-lg pl-3 pr-3"
              type="button"
              color={tableInfo?.addButton?.color || 'primary'}
              title={tableInfo?.addButton?.title}
              onClick={tableInfo?.addButton?.onClick}
            >
              {tableInfo?.addButton.value} <Plus size="16" />
            </Button>
          )}
          {tableInfo?.hasSearch && (
            <Input
              className="form-control mb-3"
              style={{ width: '280px' }}
              type={tableInfo?.hasSearch?.type || 'text'}
              placeholder={tableInfo?.hasSearch?.placeholder || 'Search...'}
              onKeyUp={(e) => {
                clearTimeout(timer);

                const value = e.target.value;

                // if (value === '') return setTableList(records);

                timer = setTimeout(() => {
                  const flatted = tableData?.map((record) => flattenObject(record));
                  const columnsNames = columns.map((col) => col.value);
                  const filtered = [];

                  // console.log(flatted);
                  columnsNames.forEach((cn) => {
                    flatted?.forEach((record) => {
                      if (record[cn]?.toLowerCase()?.includes(value?.toLowerCase())) {
                        filtered.push(record);
                      }
                    });
                  });

                  console.log(filtered);
                }, 700);
              }}
            />
          )}
        </>
      )}
      <table
        className={`${styles.Table} ${className} table table-hover`}
        ref={tableRef}
        {...rest}
      >
         <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.value} scope="col">{column.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((record) => (
            <tr key={record.keyRecord || record?.id}>
              {columns.map((col, i) => (
                <td key={col.id}>{record[col?.value]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {hasPagination && (<Pagination pagination={{ page: 1, lastPage: 20 }} />)}
    </>
  );
};

export default Table;
