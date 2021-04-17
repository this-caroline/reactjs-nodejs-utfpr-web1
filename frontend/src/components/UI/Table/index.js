import React, { createRef, useCallback, useState } from 'react';
import { Button, Col, Input, Row } from 'reactstrap';
import { ChevronDown, ChevronUp, Plus } from 'react-feather';
import { Controller, useForm } from 'react-hook-form';
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

const appendActions = (result, tableData) => result.map((item) => ({
  ...item,
  actions: tableData?.map((item) => ({
    key: item.keyRecord,
    content: item.actions,
  })).find((actItem) =>
    actItem.key.toString() === item.keyRecord.toString()
  )?.content,
}));

const Table = (props) => {
  let timer = null;
  const tableBodyRef = createRef();
  const {
    tableId = '',
    children,
    className,
    tableInfo,
    defaultSorted,
    tableData = [],
    columns = [],
    hasPagination = true,
    recordsPerPage = 5,
    ...rest
  } = props;
  const { control } = useForm({ mode: 'onBlur' });
  const [idxStart, setIdxStart] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [order, setOrder] = useState(defaultSorted?.order || 'asc');

  const sortItems = (arr, column) => {
    const sortField = column.sortField || column.value;

    const sorted = arr.sort((a, b) => {
      if (order === 'asc') {
        if (column.sortType === 'date') {
          if (dayjs.utc(a[sortField]).isBefore(dayjs.utc(b[sortField]))) return -1;
          if (dayjs.utc(a[sortField]).isAfter(dayjs.utc(b[sortField]))) return 1;
          return 0;
        }

        if (a[sortField] < b[sortField]) return -1;
        if (a[sortField] > b[sortField]) return 1;
        return 0;
      }

      if (column.sortType === 'date') {
        if (dayjs.utc(b[sortField]).isBefore(dayjs.utc(a[sortField]))) return -1;
        if (dayjs.utc(b[sortField]).isAfter(dayjs.utc(a[sortField]))) return 1;
        return 0;
      }

      if (b[sortField] < a[sortField]) return -1;
      if (b[sortField] > a[sortField]) return 1;
      return 0;
    });

    return sorted;
  };

  const [result, setResult] = useState(
    sortItems(
      tableData?.map((record) => flattenObject(record)),
      defaultSorted?.value || columns?.[0]
    )
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
    setIdxStart(1);
    setCurrentPage(1);
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

  // useEffect(() => {
  //   setResult(tableData?.map((record) => flattenObject(record)));
  // }, [tableData]);

  const resultWithActions = hasPagination && idxStart
    ? appendActions(
        result.slice(idxStart - 1).filter((_res, i) => i < recordsPerPage),
        tableData
      )
    : appendActions(result, tableData)

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
                // defaultValue={new Date().toISOString().split('T')[0]}
                render={({ value, onChange }) => (
                  <Input
                    value={value}
                    name="searchInput"
                    id="searchInput"
                    style={{ width: tableInfo?.hasSearch?.width || '280px' }}
                    type={tableInfo?.hasSearch?.type || 'text'}
                    placeholder={tableInfo?.hasSearch?.placeholder || 'Search...'}
                    className="form-control mb-3"
                    onChange={(e) => {
                      if (!e.target.value) restoreRecords();
                      setIdxStart(1);
                      onChange(e);
                      return null;
                    }}
                    onBlur={(e) => {
                      if (!e.target.value) return restoreRecords();
                      if (tableInfo?.hasSearch?.type === 'date') {
                        setIdxStart(null);
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
                    <th key={column.value} scope="col">
                      <div className="d-flex">
                        {column.name} {!!column.sort && (
                          <div
                            className="d-flex align-items-center ml-2"
                            title="Click to order by this column"
                            onClick={() => {
                              const sorted = sortItems(result, column);

                              setResult(sorted);
                              setOrder((value) => value === 'asc' ? 'desc' : 'asc');
                            }}
                          >
                            {order === 'asc'
                              ? <ChevronDown size="13" cursor="pointer" />
                              : <ChevronUp size="13" cursor="pointer" />
                            }
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody ref={tableBodyRef}>
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
        <Pagination
          recordsLength={result?.length}
          maxPagesPerBar={5}
          recordsPerPage={recordsPerPage}
          setIdxStart={setIdxStart}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </>
  );
};

export default Table;
