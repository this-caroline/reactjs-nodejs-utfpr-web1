import React from 'react';
import { Button, Modal } from 'react-bootstrap';

const CustomModal = (props) => {
  const {
    onClose,
    body,
    title,
    size = 'lg',
    subTitle,
    closeButton = false,
    ...rest
  } = props;

  return (
    <Modal animation={false} show onHide={onClose} {...rest} size={size}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!!subTitle && <h6 className="h6 text-muted mt-2 mb-4">{subTitle}</h6>}
        {body}
      </Modal.Body>
      {closeButton && (
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose} title="Click to close">
            Close
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default CustomModal;
