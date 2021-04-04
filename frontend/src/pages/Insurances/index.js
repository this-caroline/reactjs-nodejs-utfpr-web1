import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';

import LoadingPage from '../../components/UI/LoadingPage';
import InsurancesList from './InsurancesList';
import NewInsuranceModal from './NewInsuranceModal';
import { Creators as InsurancesActions } from '../../store/ducks/insurances/reducer';

const Insurances = () => {
  const [insuranceModal, setInsuranceModal] = useState(null);
  const insurances = useSelector((state) => state.insurances);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(InsurancesActions.fetchInsurances());
  }, [dispatch]);

  if (insurances.loading) {
    return <LoadingPage />;
  }

  return (
    <Container fluid className="mt-4 w-100">
      {insuranceModal && (
        <NewInsuranceModal
          data={insuranceModal.insurance}
          mode={insuranceModal.mode}
          onClose={() => setInsuranceModal(null)}
        />
      )}
      <Row className="m-auto w-100">
        <Col className="table-responsive">
          <InsurancesList
            records={insurances?.insurances || []}
            setInsuranceModal={setInsuranceModal}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Insurances;
