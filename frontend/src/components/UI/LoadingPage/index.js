import React from 'react';

const LoadingPage = (props) => {
  const { align, message = 'Please wait. The page is loading...', ...rest } = props;

  return (
    <div
      className={`d-flex w-100 justify-content-${align || 'center'} align-items-start mt-2`}
      {...rest}
    >
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
