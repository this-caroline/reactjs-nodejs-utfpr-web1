import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import DeleteAlert from '../../components/UI/DeleteAlert';

import Table from '../../components/UI/Table';
import TableActions from '../../components/UI/Table/TableActions';
import { deleteInsurance } from '../../services/requests/insurances';
import { UNEXPECTED_ERROR_MSG } from '../../utils/contants';
import { Creators as InsurancesActions } from '../../store/ducks/insurances/reducer';

const columns = [
  { name: 'ID', value: 'id', id: 1 },
  { name: 'Company', value: 'name', id: 2 },
  { name: 'Created At', value: 'createdAt', id: 3 },
  { name: 'Last Modified By', value: 'username', id: 4 },
  { name: 'Actions', value: 'actions', id: 5 },
];

const InsurancesList = ({ records, setInsuranceModal }) => {
  const insurances = useSelector((state) => state.insurances);
  const dispatch = useDispatch();

  const getMessage = () => {
    if (records?.length === 1) {
      return 'Currently you have one insurance registered.';
    }

    if (records?.length > 1) {
      return `Currently you have ${records.length} records registered.`;
    }

    return 'You have not insurances registered.';
  };

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

  const tableData = records.map((record) => ({
    keyRecord: record?.id,
    id: record?.id || 'Not Provided',
    name: record?.name || 'Not Provided',
    createdAt: record?.createdAt
      ? new Date(record?.createdAt).toLocaleString()
      : 'Not Provided',
    username: record?.User?.username || record?.username || 'Not provided',
    actions: (
      <TableActions
        del={{
          visible: true,
          title: 'Click to delete this insurance',
          onClick: () => handleDelete(record.id),
        }}
        edit={{
          visible: true,
          title: 'Click to edit this insurance',
          onClick: () => setInsuranceModal({ insurance: record, mode: 'edit' }),
        }}
      />
    ),
  }));

  return (
    <>
      <Table
        columns={columns}
        tableData={tableData}
        columnsNames={['name', 'createdAt', 'username']}
        tableInfo={{
          visible: true,
          hasSearch: true,
          title: 'Insurances',
          message: getMessage(),
          addButton: {
            visible: true,
            value: 'Add Insurance',
            title: 'Click to add a new insurance',
            onClick: () => setInsuranceModal({ mode: 'include' }),
          },
        }}
      />
    </>
  );
};

export default InsurancesList;
