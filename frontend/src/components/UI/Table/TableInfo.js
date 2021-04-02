import React from 'react';
import { Plus } from 'react-feather';
import { Button, Col, Row } from 'reactstrap';

const TableInfo = ({ title, message, addButton, size = 0 }) => {
  let className = 'd-flex flex-wrap align-items-end justify-content-between';

  if (size === 0) {
    className = 'd-flex flex-wrap flex-column align-items-start justify-content-between';
  }

  return (
    <div className={className}>
      <Row className="mr-2">
        <Col>
          <h3 style={{ color: '#515151' }} className="font-weight-bold h5 mb-1">
            {title}
          </h3>
          <p className="text-muted">{message}</p>
        </Col>
      </Row>
      {addButton.visible && (
        <Button
          className="mb-3 width-lg pl-3 pr-3"
          type="button"
          color={addButton.color || 'primary'}
          title={addButton.title}
          onClick={addButton.onClick}
        >
          {addButton.value} <Plus size="16" />
        </Button>
      )}
    </div>
  );
};

export default TableInfo;