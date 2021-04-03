import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import PatientsList from './PatientsList';
import PatientModal from './PatientModal';
import LoadingPage from '../../components/UI/LoadingPage';
import { Creators as InsurancesActions } from '../../store/ducks/insurances/reducer';
import { Creators as PatientsActions } from '../../store/ducks/patients/reducer';

const Patients = () => {
  const insurances = useSelector((state) => state.insurances);
  const patients = useSelector((state) => state.patients);
  const dispatch = useDispatch();
  const [patientModal, setPatientModal] = useState(null);
  // const [patientsList, setPatientsList] = useState(null);

  useEffect(() => {
    // (async () => {
    //   try {
    //     dispatch(InsurancesActions.fetchInsurances());
    //     const response = await fetchPatients();

    //     if (response.success) {
    //       setPatientsList(response.data?.patients || []);
    //     } else throw new Error();
    //   } catch (error) {
    //     Swal.fire('Something went wrong!', INTERNAL_ERROR_MSG, 'error');
    //   }

    //   setLoading(false);
    // })();
    dispatch(InsurancesActions.fetchInsurances());
    dispatch(PatientsActions.fetchPatients());
  }, [dispatch]);

  if (!patients || !insurances) return <LoadingPage />;
  // if (patients.loading || insurances.loading) return <LoadingPage />;
  // if (
  //   (!patients.loading && !patients.patients) ||
  //   (!insurances.loading && !insurances.insurances)
  // ) {
  //   /** TO DO: Implement appropriate component to handle error messages... */
  //   return <h2>{INTERNAL_ERROR_MSG}</h2>;
  // }

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
