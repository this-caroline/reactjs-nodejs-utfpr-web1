
import React from 'react';
import { Search, Edit, Trash, X } from 'react-feather';

/**
 * @param {Object} edit - Object with edit properties.
 * @param {Object} view - Object with view/search properties.
 * @param {Object} del - Object with delete properties.
 * @param {Object} send - Object with send properties.
 * @param {Object} remove - Object with remove properties.
 */
const TableActions = ({
  view,
  edit,
  del,
  remove
}) => {
  return (
    <div className="d-flex justify-content-evenly align-items-center">
      {(view?.visible) && (
        <span onClick={view.onClick} title={view.title || 'View'}>
          <Search
            cursor="pointer"
            size="16"
            color={view.color || '#669de6'}
            className="mr-3"
          />
        </span>
      )}

      {edit?.visible && (
        <span onClick={edit.onClick} title={edit.title || 'Edit'}>
          <Edit
            cursor="pointer"
            size="16"
            color={edit.color || '#ffc700'}
            className="mr-3"
          />
        </span>
      )}

      {del?.visible && (
        <span onClick={del.onClick} title={del.title || 'Delete'}>
          <Trash
            size="16"
            cursor="pointer"
            color={del.color || '#ff3655'}
          />
        </span>
      )}

      {remove?.visible && (
        <span onClick={remove.onClick} title={remove.title || 'Remove'}>
          <X size="16" cursor="pointer" color={remove.color || '#ff3655'} />
        </span>
      )}
    </div>
  );
};

export default TableActions;
