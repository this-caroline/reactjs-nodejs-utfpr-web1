import React from 'react';

const InvalidInputMessage = ({ message }) => {
  return (
    <span className="text-danger secondary-text small">
      <small>{message}</small>
    </span>
  );
};

export default InvalidInputMessage;
