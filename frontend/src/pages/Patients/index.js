import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'reactstrap';
import Swal from 'sweetalert2';

import PatientModal from './PatientModal';
import LoadingPage from '../../components/UI/LoadingPage';
import TableInfo from '../../components/UI/Table/TableInfo';
import { fetchPatients } from '../../services/requests/patients';
import { INTERNAL_ERROR_MSG } from '../../utils/contants';
import PatientsList from './PatientsList';

const Patients = () => {
  const [patientModal, setPatientModal] = useState(null);
  const [patientsList, setPatientsList] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetchPatients();

        if (response.success) {
          setPatientsList(response.data?.patients || []);
        } else throw new Error();
      } catch (error) {
        Swal.fire('Something went wrong!', INTERNAL_ERROR_MSG, 'error');
      }

      setLoading(false);
    })();
  }, []);

  if (isLoading) return <LoadingPage />;
  if (!isLoading && !patientsList) {
    /** TO DO: Improve error messages/components... */
    return <h2>{INTERNAL_ERROR_MSG}</h2>;
  }

  const getMessage = () => {
    if (patientsList?.length === 1) {
      return 'Currently you have one patient registered.';
    }

    if (patientsList?.length > 1) {
      return `Currently you have ${patientsList?.length} patients registered.`;
    }

    return 'You have not patients registered yet.';
  };

  return (
    <Container fluid className="mt-4 w-100">
      {patientModal && (
        <PatientModal
          data={patientModal.patient}
          mode={patientModal.mode}
          patientsList={patientsList}
          setPatientsList={setPatientsList}
          onClose={() => setPatientModal(null)}
        />
      )}
      <Row className="m-auto w-100">
        <Col className="table-responsive">
          <TableInfo
            title="Patients"
            size={patientsList.length}
            message={getMessage()}
            addButton={{
              visible: true,
              value: 'Add Patient',
              title: 'Click to add a new patient',
              onClick: () => setPatientModal({ mode: 'include' }),
            }}
          />
          <PatientsList
            records={patientsList || []}
            setPatientsList={setPatientsList}
            setPatientModal={setPatientModal}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Patients;
