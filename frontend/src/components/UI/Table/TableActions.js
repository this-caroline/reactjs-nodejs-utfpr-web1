
import React from 'react';
import {
  PlusCircle,
  Search,
  Edit,
  Trash,
  X,
  Calendar,
  CheckCircle,
} from 'react-feather';

/**
 * @param {Object} check - Object with check/confirmation properties.
 * @param {Object} edit - Object with edit properties.
 * @param {Object} view - Object with view/search properties.
 * @param {Object} del - Object with delete properties.
 * @param {Object} calendar - Object with calendar/schedule properties.
 * @param {Object} remove - Object with remove properties.
 */
const TableActions = ({
  add,
  view,
  check,
  calendar,
  edit,
  del,
  remove
}) => {
  return (
    <div className="d-flex justify-content-evenly align-items-center">
      {(view?.visible) && (
        <span onClick={view.onClick} title={view.title || 'View'} className="mr-3">
          <Search
            cursor="pointer"
            size="16"
            color={view.color || '#669de6'}
          />
        </span>
      )}

      {add?.visible && (
        <span onClick={add.onClick} title={add.title} className="mr-3">
          <PlusCircle
            cursor="pointer"
            size="16"
            color={add.color || '#669de6'}
          />
        </span>
      )}

      {check?.visible && (
        <span onClick={check.onClick} title={check.title} className="mr-3">
          <CheckCircle
            cursor="pointer"
            size="16"
            color={check.color || '#03c474'}
          />
        </span>
      )}

      {calendar?.visible && (
        <span onClick={calendar.onClick} title={calendar.title} className="mr-3">
          <Calendar
            cursor="pointer"
            size="16"
            color={calendar.color || '#03c474'}
          />
        </span>
      )}

      {edit?.visible && (
        <span onClick={edit.onClick} title={edit.title || 'Edit'} className="mr-3">
          <Edit
            cursor="pointer"
            size="16"
            color={edit.color || '#ffc700'}
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
