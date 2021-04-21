import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import PatientsList from './PatientsList';
import PatientModal from './PatientModal';
import LoadingPage from '../../components/UI/LoadingPage';
import { Creators as InsurancesActions } from '../../store/ducks/insurances/reducer';
// import { Creators as PatientsActions } from '../../store/ducks/patients/reducer';

const Patients = () => {
  const insurances = useSelector((state) => state.insurances);
  const patients = useSelector((state) => state.patients);
  const dispatch = useDispatch();
  const [patientModal, setPatientModal] = useState(null);

  useEffect(() => {
    dispatch(InsurancesActions.fetchInsurances());
    
    // if (!patients) {
      
    // }
  }, [dispatch]);

  if (!patients || !insurances) return <LoadingPage />;

  return (
    <Container fluid className="mt-4 w-100">
      {patientModal && (
        <PatientModal
          data={patientModal.patient}
          mode={patientModal.mode}
          patientsList={patients?.patients}
          onClose={() => setPatientModal(null)}
        />
      )}
      <Row className="m-auto w-100">
        <Col className="table-responsive">
          <PatientsList
            records={patients?.patients || []}
            setPatientModal={setPatientModal}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Patients;
