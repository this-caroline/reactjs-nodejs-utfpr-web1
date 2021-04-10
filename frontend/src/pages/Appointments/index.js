import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';

import LoadingPage from '../../components/UI/LoadingPage';
import AppointmentsList from './AppointmentsList';
import { Creators as AppointmentsActions } from '../../store/ducks/appointments/reducer';
// import { fetchAppointments } from '../../services/requests/appointments';

const Appointments = () => {
  const dispatch = useDispatch();
  const { loading, appointments } = useSelector((state) => state.appointments);
  // const [appointmentsList, setAppointmentsList] = useState(null);
  // const [appointmentModal, setAppointmentModal] = useState(null);

  useEffect(() => {
    // (async () => {
    //   const response = await fetchAppointments();

    //   if (response.success) {
    //     setAppointmentsList(response?.data?.appointments);
    //   } else setAppointmentsList('error');
    // })();
    dispatch(AppointmentsActions.fetchAppointments());
  }, [dispatch]);

  // if (appointmentsList === 'error') {
  //   return <h2>Something went wrong...</h2>;
  // }

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <Container fluid className="mt-4 w-100">
      <Row className="m-auto w-100">
        <Col className="table-responsive">
          <AppointmentsList
            records={appointments || []}
            setAppointmentsList={appointments}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Appointments;
