import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Container, Row } from "reactstrap";

import LoadingPage from "../../components/UI/LoadingPage";
import { Creators as AppointmentsActions } from "../../store/ducks/appointments/reducer";
import ConfirmedScheduleList from "./ConfirmedSchedule";

const ConfirmedSchedule = () => {
  const dispatch = useDispatch();
  const appointments = useSelector((state) => state.appointments);

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
          <ConfirmedScheduleList records={appointments?.appointments || []} />
        </Col>
      </Row>
    </Container>
  );
};

export default ConfirmedSchedule;
