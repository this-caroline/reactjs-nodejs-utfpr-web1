import React from 'react';

const Select = (props) => {
  const { options, hasError, ...rest } = props;

  return (
    <select
      className={hasError ? 'is-invalid form-control' : 'form-control'}
      {...rest}
    >
      {options.map((option, i) => (
        <option key={option?.value || i} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
