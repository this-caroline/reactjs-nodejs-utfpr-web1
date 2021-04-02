import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';

import TableInfo from '../../components/UI/Table/TableInfo';
import LoadingPage from '../../components/UI/LoadingPage';
import InsurancesList from './InsurancesList';
import NewInsuranceModal from './NewInsuranceModal';
import { Creators as InsurancesActions } from '../../store/ducks/insurances/reducer';

const Insurances = () => {
  const [insuranceModal, setInsuranceModal] = useState(null);
  const insurances = useSelector((state) => state.insurances);
  const dispatch = useDispatch();

  const getMessage = () => {
    if (insurances.insurances?.length === 1) {
      return 'Currently you have one insurance registered.';
    }

    if (insurances.insurances?.length > 1) {
      return `Currently you have ${insurances.insurances.length} records registered.`;
    }

    return 'You have not insurances registered.';
  };

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
          <TableInfo
            title="Insurances"
            size={insurances?.insurances?.length}
            message={getMessage()}
            addButton={{
              visible: true,
              value: 'Add Insurance',
              title: 'Click to add a new insurance',
              onClick: () => setInsuranceModal({ mode: 'include' }),
            }}
          />
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
