import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import DeleteAlert from '../../components/UI/DeleteAlert';

import Table from '../../components/UI/Table';
import TableActions from '../../components/UI/Table/TableActions';
import { deleteInsurance } from '../../services/requests/insurances';
import { UNEXPECTED_ERROR_MSG } from '../../utils/contants';
import { Creators as InsurancesActions } from '../../store/ducks/insurances/reducer';

const InsurancesList = ({ records, setInsuranceModal }) => {
  const insurances = useSelector((state) => state.insurances);
  const dispatch = useDispatch();

  const handleDelete = (id) => {
    DeleteAlert({
      hasLoading: true,
      text: 'The insurance data will be permanently deleted.',
      confirmButtonText: 'Yes, delete insurance',
      cancelButtonText: 'No, keep this insurance',
      onConfirm: async () => {
        try {
          const response = await deleteInsurance(id);
          
          if (response.success) {
            if (Swal.isVisible()) Swal.close();

            dispatch(
              InsurancesActions.setInsurances(
                [...insurances.insurances].filter(
                  (ins) => ins.id.toString() !== id.toString()
                )
              )
            );
          } else throw new Error();
        } catch (error) {
          if (Swal.isVisible()) Swal.close();
          Swal.fire('Unexpected error', UNEXPECTED_ERROR_MSG, 'error');  
        }
      },
    });
  };

  if (!records || !records?.length) return null;

  return (
    <>
      <Table>
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Company</th>
            <th scope="col">Created At</th>
            <th scope="col">Modified By</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((insurance) => (
            <tr key={insurance.id}>
              <td>{insurance.id}</td>
              <td>{insurance.name}</td>
              <td>{new Date(insurance.createdAt).toLocaleString()}</td>
              <td>{insurance?.User?.username || 'Not provided'}</td>
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
                    onClick: () => setInsuranceModal({ insurance, mode: 'edit' }),
                  }}
                />
              </td>
            </tr>
          ))
          }
        </tbody>
      </Table>
    </>
  );
};

export default InsurancesList;
