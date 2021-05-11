import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';

import LoadingPage from '../../components/UI/LoadingPage';
import AppointmentsList from './AppointmentsList';
import { Creators as AppointmentsActions } from '../../store/ducks/appointments/reducer';

const Appointments = () => {
  const dispatch = useDispatch();
  const appointments  = useSelector((state) => state.appointments);

  useEffect(() => {
    dispatch(AppointmentsActions.fetchAppointments());
  }, [dispatch]);


  if (appointments?.loading) {
    return <LoadingPage />;
  }

  return (
    <Container fluid className="mt-4 w-100">
      <Row className="m-auto w-100">
        <Col className="table-responsive">
          <AppointmentsList
            records={appointments?.appointments || []}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Appointments;
