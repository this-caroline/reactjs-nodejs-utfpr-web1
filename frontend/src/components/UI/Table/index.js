import React, { createRef, useCallback, useEffect, useState } from 'react';
import { Button, Col, Input, Row } from 'reactstrap';
import { Plus } from 'react-feather';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import styles from './Table.module.css';
import Pagination from '../Pagination';
import { getUniqueObject } from '../../../utils/unique';
import { Controller, useForm } from 'react-hook-form';

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
  // const [isReady, setReady] = useState(tableInfo?.hasSearch?.type !== 'date');
  const { control } = useForm({ mode: 'onBlur' });
  const [result, setResult] = useState(
    tableData?.map((record) => flattenObject(record))
  );

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

    setResult(flatted);
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
    const auxFounded = [];
    const foundItemsKeys = found.map(
      (item) => item.keyRecord.toString()
    );

    // console.log(flatted, found, value);
    flatted.forEach((record) => {
        if (foundItemsKeys.includes(record.keyRecord.toString())) {
          auxFounded.push(record);
        }
    });

    setResult(found);
    setDataIndication(found.length);
  }, [columns, setDataIndication, tableData]);

  useEffect(() => {
    setResult(tableData?.map((record) => flattenObject(record)));
  }, [tableData]);

  const resultWithActions = result.map((item) => ({
    ...item,
    actions: tableData?.map((item) => ({
      key: item.keyRecord,
      content: item.actions,
    })).find((actItem) =>
      actItem.key.toString() === item.keyRecord.toString()
    )?.content,
  }));

  // console.log(result, tableData);
  // console.log(result, resultWithActions);

  return (
    <>
      <div
        id={`${tableId}-custom-table-container`}
        className="table-responsive w-100"
      >
        {tableInfo?.visible && (
          <>
            <Row className="mr-2">
              <Col>
                <h3
                  style={{ color: '#515151' }}
                  className="font-weight-bold h5 mb-1"
                >
                  {tableInfo?.title}
                </h3>
                <p className="text-muted">
                  {tableInfo?.message}
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
            {(!!tableData?.length && tableInfo?.hasSearch) && (
              <Controller
                name="searchInput"
                control={control}
                defaultValue=""
                render={({ value, onChange }) => (
                  <Input
                    // onChange={onChange}
                    value={value}
                    name="searchInput"
                    id="searchInput"
                    style={{ width: tableInfo?.hasSearch?.width || '280px' }}
                    type={tableInfo?.hasSearch?.type || 'text'}
                    placeholder={tableInfo?.hasSearch?.placeholder || 'Search...'}
                    // disabled={!isReady}
                    className="form-control mb-3"
                    onChange={(e) => {
                      if (!e.target.value) restoreRecords();
                      // setDate(e.target.value);
                      onChange(e);
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
              />
            )}
          </>
        )}
        {!!tableData?.length && (
          <table
            className={`${styles.Table} ${className || ''} table table-hover`}
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
                {/* {tableData.map((record) => ( */}
                {resultWithActions.map((record) => (
                  <tr key={record.keyRecord} id={`${tableId}-${record.keyRecord}`}>
                    {columns.map((col) => (
                      <td key={col.id}>{record[col?.value]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </>
          </table>
        )}
      </div>
      {hasPagination && (
        <Pagination pagination={{ page: result?.length / 5, lastPage: 20 }} />
      )}
    </>
  );
};

export default Table;
