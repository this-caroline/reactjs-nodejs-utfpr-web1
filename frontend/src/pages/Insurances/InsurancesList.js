import React from 'react';

import Table from '../../components/UI/Table';
import TableActions from '../../components/UI/Table/TableActions';

const InsurancesList = ({ records }) => {
  const handleDelete = (id) => {
    console.log('Clicked to delete:', id);
  };

  const handleEdit = (insurance) => {
    console.log('Clicked to edit:', insurance);
  };

  if (!records || !records?.length) return null;

  return (
    <Table>
      <thead>
        <tr>
          <th scope="col">Id</th>
          <th scope="col">Company</th>
          <th scope="col">Created At</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        {records.map((insurance) => (
          <tr key={insurance.id}>
            <td>{insurance.id}</td>
            <td>{insurance.name}</td>
            <td>{new Date(insurance.createdAt).toLocaleString()}</td>
            <td>
              <TableActions
                del={{
                  visible: true,
                  title: 'Click to delete this insurance',
                  onClick: () => handleDelete(insurance.id),
                }}
                edit={{
                  visible: true,
                  title: 'Click to edit this insurance',
                  onClick: () => handleEdit(insurance),
                }}
              />
            </td>
          </tr>
        ))
        }
      </tbody>
    </Table>
  );
};

export default InsurancesList;
