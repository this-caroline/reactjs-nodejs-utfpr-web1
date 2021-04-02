import React from 'react';

const LoadingPage = ({ message = 'Please wait. The page is loading...' }) => {
  return (
    <div className="d-flex w-100 justify-content-center align-items-start mt-2">
      <div className="d-flex align-items-center">
        <span className="mr-3">{message}</span>
        <div
          className="spinner-border text-primary spinner-border-sm"
          role="status"
        />
      </div>
    </div>
  );
};

export default LoadingPage;
