import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'reactstrap';

import LoadingPage from '../../components/UI/LoadingPage';
import AppointmentsList from './AppointmentsList';
import { fetchAppointments } from '../../services/requests/appointments';

const Appointments = () => {
  const [appointmentsList, setAppointmentsList] = useState(null);
  // const [appointmentModal, setAppointmentModal] = useState(null);

  useEffect(() => {
    (async () => {
      const response = await fetchAppointments();

      if (response.success) {
        setAppointmentsList(response?.data?.appointments);
      } else setAppointmentsList('error');
    })();
  }, []);

  if (appointmentsList === 'error') {
    return <h2>Something went wrong...</h2>;
  }

  if (!appointmentsList) {
    return <LoadingPage />;
  }

  return (
    <Container fluid className="mt-4 w-100">
      <Row className="m-auto w-100">
        <Col className="table-responsive">
          <AppointmentsList records={appointmentsList || []} />
        </Col>
      </Row>
    </Container>
  );
};

export default Appointments;
