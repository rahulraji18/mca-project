import React, { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

function AlertComponent({ variant, messages ,heading}) {
  const [showAlert, setShowAlert] = useState(true);

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <div>
      {showAlert && (
        <Alert variant={variant}>
          <Button
            onClick={handleCloseAlert}
            className="float-end btn-close"
            variant={variant}
          >
            <span aria-hidden="true">×</span>
          </Button>
          {heading && <Alert.Heading>{heading}</Alert.Heading>}
          <ul>
            {messages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </Alert>
      )}
    </div>
  );
}

export default AlertComponent;
