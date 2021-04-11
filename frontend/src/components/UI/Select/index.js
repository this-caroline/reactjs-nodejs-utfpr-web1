import React from 'react';

const Select = (props) => {
  const { options, hasError, value, ...rest } = props;

  return (
    <select
      // defaultValue={value}
      value={value}
      className={hasError ? 'is-invalid form-control' : 'form-control'}
      {...rest}
    >
      {options.map((option, i) => (
        <option
          key={option?.value || i}
          value={option.value}
          defaultValue={value}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
