import React from 'react';
import { Col, Container, Row } from 'reactstrap';

import TableInfo from '../../components/UI/Table/TableInfo';
import InsurancesList from './InsurancesList';

const insurancesList = [
  {
    id: 1,
    name: 'Unimed',
    createdAt: '09/08/2020',
  },
  {
    id: 2,
    name: 'Health',
    createdAt: '15/05/2019',
  },
  {
    id: 3,
    name: 'Life',
    createdAt: '14/03/2021',
  },
];

const Insurances = () => {
  const getMessage = () => {
    if (insurancesList?.length === 1) {
      return 'Currently you have one insurance registered.';
    }

    if (insurancesList?.length > 1) {
      return `Currently you have ${insurancesList.length} records registered.`;
    }

    return 'You have not insurances registered.';
  };

  return (
    <Container fluid className="w-100" style={{ marginTop: 30 }}>
      <Row className="m-auto w-100">
        <Col className="table-responsive">
          <TableInfo
            title="Insurances"
            message={getMessage()}
            addButton={{
              visible: true,
              value: 'Add Insurance',
              title: 'Click to add a new insurance',
              onClick: () => console.log('Clicked to add new insurance.'),
            }}
          />
          <InsurancesList records={insurancesList} />
        </Col>
      </Row>
    </Container>
  );
};

export default Insurances;
