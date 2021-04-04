import React, { createRef } from 'react';
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
  const tableBodyRef = createRef();
  const {
    // tableId = '', // to handle correct table...
    children,
    className,
    tableInfo,
    tableData = [],
    columns = [],
    hasPagination = false,
    ...rest
  } = props;

  const setDataIndication = (length) => {
    const noDataEl = document.getElementById('no-data-indication-paragraph');

    if (!length && noDataEl) return true;

    const containerEl = document.getElementById('custom-table-container');

    if (noDataEl && containerEl) {
      if (!length) {
        const noDataEl = document.createElement('p');
  
        noDataEl.id = 'no-data-indication-paragraph';
        noDataEl.textContent = 'Sorry. No records were found.';
        noDataEl.classList.add(styles.NoDataIndication);
        containerEl.appendChild(noDataEl);
      } else {
        containerEl.removeChild(noDataEl);
      }
    }
  };

  const restoreRecords = () => {
    const flatted = tableData?.map((record) => flattenObject(record));

    flatted.forEach((record) => {
      const row = document.getElementById(record.keyRecord);

      if (row) row.style.display = '';
    });

    return setDataIndication(true);
  };

  const filterSearch = (value) => {
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

    flatted.forEach((record) => {
      const row = document.getElementById(record.keyRecord);
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
  };


  return (
    <div id="custom-table-container" className="table-responsive w-100">
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
              defaultValue={tableInfo?.hasSearch?.type === 'date'
                ? dayjs(new Date()).format('YYYY-MM-DD')
                : ''
              }
              style={{ width: tableInfo?.hasSearch?.width || '280px' }}
              type={tableInfo?.hasSearch?.type || 'text'}
              placeholder={tableInfo?.hasSearch?.placeholder || 'Search...'}
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
        </>
      )}
      <table
        className={`${styles.Table} ${className || ''} table table-hover`}
        {...rest}
      >
         <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.value} scope="col">{column.name}</th>
            ))}
          </tr>
        </thead>
        <tbody ref={tableBodyRef}>
          {tableData.map((record) => (
            <tr key={record.keyRecord} id={record.keyRecord}>
              {columns.map((col) => (
                <td key={col.id}>{record[col?.value]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {hasPagination && (<Pagination pagination={{ page: 1, lastPage: 20 }} />)}
    </div>
  );
};

export default Table;
