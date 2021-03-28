import React from 'react';
import Alert from 'react-bootstrap/Alert';
import { AlertCircle } from 'react-feather';

import styles from './Alert.module.css';

const CustomAlert = ({
  dismissible = true,
  message,
  title,
  type,
  onClose
}) => {
  return (
    <Alert
      variant={type}
      onClose={onClose}
      dismissible={dismissible}
    >
      {!!title &&
        <span className={styles.Title}>
          <strong>{title}</strong>&nbsp;-&nbsp;
        </span>
      }
      {type === 'danger' && <AlertCircle className="mr-2" />}
      <span className={styles.Message}>{message}</span>
    </Alert>
  );
};

export default CustomAlert;
