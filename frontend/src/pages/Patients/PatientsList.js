import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

import Table from '../../components/UI/Table';
import TableActions from '../../components/UI/Table/TableActions';
import ConfirmAlert from '../../components/UI/ConfirmAlert';
import { deletePatient } from '../../services/requests/patients';
import { UNEXPECTED_ERROR_MSG } from '../../utils/contants';
import PatientAppointmentsModal from './PatientAppointmentsModal';
import { Creators as PatientsCreators } from '../../store/ducks/patients/reducer';

const columns = [
  { name: 'Name', value: 'name', id: 1 },
  { name: 'CPF', value: 'cpf', id: 2 },
  { name: 'Phone', value: 'phoneNumber', id: 3 },
  { name: 'Birthdate', value: 'birthdate', id: 4 },
  { name: 'City', value: 'city', id: 5 },
  { name: 'Actions', value: 'actions', id: 6 },
];

const PatientsList = ({ records, setPatientModal }) => {
  const [appointmentsModal, setAppointmentsModal] = useState(null);
  // const { patients } = useSelector((state) => state.patients);
  const dispatch = useDispatch();

  if (!records || !records?.length) return null;

  const handleDelete = (id) => {
    ConfirmAlert({
      hasLoading: true,
      text: 'The patient data will be permanently deleted.',
      confirmButtonText: 'Yes, delete patient',
      cancelButtonText: 'No, keep this patient',
      onConfirm: async () => {
        try {
          const response = await deletePatient(id);
   
          if (response.success) {
            if (Swal.isVisible()) Swal.close();

            dispatch(PatientsCreators.setPatients([...records].filter(
              (pat) => pat.id.toString() !== id.toString())
            ));
          } else throw new Error();
        } catch (error) {
          if (Swal.isVisible()) Swal.close();
          Swal.fire('Unexpected error', UNEXPECTED_ERROR_MSG, 'error');  
        }
      },
    });
  };

  const getMessage = () => {
    if (records.length === 1) {
      return 'Currently you have one patient registered.';
    }

    if (records.length > 1) {
      return `Currently you have ${records.length} patients registered.`;
    }

    return 'You have not patients registered yet.';
  };

  const tableData = records.map((patient) => ({
    keyRecord: patient.id,
    name: patient?.name || 'Not Provided',
    cpf: patient?.cpf || 'Not Provided',
    phoneNumber: patient?.phoneNumber || 'Not Provided',
    birthdate: patient.birthdate 
      ? new Date(patient.birthdate).toLocaleDateString()
      : 'Not Provided',
    city: patient?.Address?.city || 'Not provided',
    actions: (
      <TableActions
        view={{
          visible: true,
          title: 'Click to view this patient',
          onClick: () => setPatientModal({ patient, mode: 'view' }),
        }}
        calendar={{
          visible: true,
          title: "Click to manage patient's appointments",
          onClick: () => setAppointmentsModal({
            onClose: () => setAppointmentsModal(null),
            pId: patient.id,
          }),
        }}
        del={{
          visible: true,
          title: 'Click to delete this patient',
          onClick: () => handleDelete(patient.id),
        }}
        edit={{
          visible: true,
          title: 'Click to edit this patient',
          onClick: () => setPatientModal({ patient, mode: 'edit' }),
        }}
      />
    ),
  }));

  return (
    <>
      {appointmentsModal && (
        <PatientAppointmentsModal
          onClose={appointmentsModal.onClose}
          pId={appointmentsModal.pId}
        />
      )}
      <Table
        columns={columns}
        tableData={tableData}
        tableInfo={{
          visible: true,
          title: 'Patients',
          message: getMessage(),
          hasSearch: true,
          addButton: {
            visible: true,
            value: 'Add Patient',
            title: 'Click to add a new patient',
            onClick: () => setPatientModal({ mode: 'include' }),
          },
        }}
      />
    </>
  );
};

export default PatientsList;
