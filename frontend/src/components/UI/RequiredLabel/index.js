import React from 'react';
import { Label } from 'reactstrap';

const RequiredLabel = (props) => {
  const { children, ...rest } = props;

  return (
    <Label {...rest}>
      {children}&nbsp;<span className="text-danger">*</span>
    </Label>
  );
};

export default RequiredLabel;
