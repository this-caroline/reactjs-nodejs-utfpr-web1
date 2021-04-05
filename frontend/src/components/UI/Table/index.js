import React, { createRef, useCallback, useEffect, useState } from 'react';
import { Button, Col, Input, Row } from 'reactstrap';
import { Plus } from 'react-feather';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import styles from './Table.module.css';
import Pagination from '../Pagination';
import { getUniqueObject } from '../../../utils/unique';

dayjs.extend(utc);

const flattenObject = function(ob) {
  var toReturn = {};
  
  for (var i in ob) {
    if (!ob.hasOwnProperty(i) || i.toString().toLowerCase() === 'actions') {
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
  const today = dayjs(new Date()).format('YYYY-MM-DD');
  const tableBodyRef = createRef();
  const {
    tableId = '',
    children,
    className,
    tableInfo,
    tableData = [],
    columns = [],
    hasPagination = false,
    ...rest
  } = props;
  const [isReady, setReady] = useState(tableInfo?.hasSearch?.type !== 'date');

  const setDataIndication = useCallback((length) => {
    const noDataEl = document.getElementById('no-data-indication-paragraph');

    if (!length && noDataEl) return true;

    const containerEl = document.getElementById(`${tableId}-custom-table-container`);

    if (containerEl) {
      if (!length) {
        const noDataEl = document.createElement('p');
  
        noDataEl.id = 'no-data-indication-paragraph';
        noDataEl.textContent = 'Sorry. No records were found.';
        noDataEl.classList.add(styles.NoDataIndication);
        containerEl?.appendChild(noDataEl);
      } else {
        if (noDataEl) containerEl?.removeChild(noDataEl);
      }
    }
  }, [tableId]);

  const restoreRecords = () => {
    const flatted = tableData?.map((record) => flattenObject(record));

    flatted.forEach((record) => {
      const row = document.getElementById(`${tableId}-${record.keyRecord}`);

      if (row) row.style.display = '';
    });

    return setDataIndication(true);
  };

  const filterSearch = useCallback((value) => {
    const flatted = tableData?.map((record) => flattenObject(record));
    const columnsNames = columns.map((col) => col.value);
    const filtered = [];

    columnsNames.forEach((cn) => {
      flatted?.forEach((record) => {
        if (
          record[cn]?.toString()
            .toLowerCase()
            ?.includes(value?.toLowerCase())
        ) {
          filtered.push(record);
        }
      });
    });

    const found = getUniqueObject(filtered, 'keyRecord');

    // console.log(flatted, found, value);
    flatted.forEach((record) => {
      const row = document.getElementById(`${tableId}-${record.keyRecord}`);
      const foundItemsKeys = found.map(
        (item) => item.keyRecord.toString()
      );

      if (row) {
        if (foundItemsKeys.includes(record.keyRecord.toString())) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      }
    });

    setDataIndication(found.length);
  }, [columns, setDataIndication, tableData, tableId]);

  useEffect(() => {
    if (tableInfo?.hasSearch?.type === 'date') {
      setTimeout(() => {
        filterSearch(dayjs(new Date()).format('DD/MM/YYYY'));
        setReady(true);
      }, 1000);
    }
  }, [filterSearch, tableInfo?.hasSearch?.type]);

  return (
    <>
      <div
        id={`${tableId}-custom-table-container`}
        className={isReady ? 'table-responsive w-100' : ''}
      >
        {tableInfo?.visible && (
          <>
            <Row className="mr-2">
              <Col>
                <h3 style={{ color: '#515151' }} className="font-weight-bold h5 mb-1">
                  {tableInfo?.title}
                </h3>
                <p className="text-muted">
                  {isReady
                    ? tableInfo?.message
                    : 'You data will appear soon in a table bellow.'
                  }
                </p>
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
                defaultValue={tableInfo?.hasSearch?.type === 'date' ? today : ''}
                style={{ width: tableInfo?.hasSearch?.width || '280px' }}
                type={tableInfo?.hasSearch?.type || 'text'}
                placeholder={tableInfo?.hasSearch?.placeholder || 'Search...'}
                disabled={!isReady}
                onChange={(e) => {
                  if (!e.target.value) return restoreRecords();
                  return null;
                }}
                onBlur={(e) => {
                  if (!e.target.value) return restoreRecords();
                  if (tableInfo?.hasSearch?.type === 'date') {
                    return filterSearch(dayjs.utc(e.target.value)
                      .format('DD/MM/YYYY'));
                  }
                }}
                onKeyUp={(e) => {
                  if (tableInfo?.hasSearch?.type === 'date') return null;

                  clearTimeout(timer);

                  const value = e.target.value;

                  timer = setTimeout(() => {
                    filterSearch(value);
                  }, 500);
                }}
              />
            )}
            {!isReady && (
              <Row className="d-flex justify-content-start text-align-left">
                <Col>
                <div className="d-flex align-items-start">
                  <span className="mr-3">Please wait. Loading data...</span>
                  <div
                    className="spinner-border text-primary spinner-border-sm"
                    role="status"
                  />
                </div>
                </Col>
              </Row>
            )}
          </>
        )}
        <table
          className={!isReady
            ? 'd-none'
            : `${styles.Table} ${className || ''} table table-hover`
          }
          {...rest}
        >
          <>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.value} scope="col">{column.name}</th>
                ))}
              </tr>
            </thead>
            <tbody ref={tableBodyRef}>
              {tableData.map((record) => (
                <tr key={record.keyRecord} id={`${tableId}-${record.keyRecord}`}>
                  {columns.map((col) => (
                    <td key={col.id}>{record[col?.value]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </>
        </table>
      </div>
      {(isReady && hasPagination) && (
        <Pagination pagination={{ page: 1, lastPage: 20 }} />
      )}
    </>
  );
};

export default Table;
