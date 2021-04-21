import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';

import LoadingPage from '../../components/UI/LoadingPage';
import AppointmentsList from './AppointmentsList';
import { Creators as AppointmentsActions } from '../../store/ducks/appointments/reducer';
// import Schedule from '../../components/UI/Schedule';
// import { fetchAppointments } from '../../services/requests/appointments';

const Appointments = () => {
  const dispatch = useDispatch();
  const appointments  = useSelector((state) => state.appointments);

  useEffect(() => {
    // (async () => {
    //   const response = await fetchAppointments();

    //   if (response.success) {
    //     setAppointmentsList(response?.data?.appointments);
    //   } else setAppointmentsList('error');
    // })();
    // dispatch(PatientsActions.fetchPatients());
    dispatch(AppointmentsActions.fetchAppointments());
  }, [dispatch]);


  if (appointments?.loading) {
    return <LoadingPage />;
  }

  return (
    <Container fluid className="mt-4 w-100">
      <Row className="m-auto w-100">
        <Col className="table-responsive">
          {/* <Schedule records={appointments || []} />  */}
          <AppointmentsList
            records={appointments?.appointments || []}
            // setAppointmentsList={appointments}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Appointments;
