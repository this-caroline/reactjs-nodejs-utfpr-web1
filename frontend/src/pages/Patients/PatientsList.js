import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';

import Table from '../../components/UI/Table';
import TableActions from '../../components/UI/Table/TableActions';
import DeleteAlert from '../../components/UI/DeleteAlert';
import { deletePatient } from '../../services/requests/patients';
import { UNEXPECTED_ERROR_MSG } from '../../utils/contants';
import PatientAppointmentsModal from './PatientAppointmentsModal';
import { Creators as PatientsCreators } from '../../store/ducks/patients/reducer';
import TableInfo from '../../components/UI/Table/TableInfo';

const PatientsList = ({ records, setPatientModal }) => {
  const [appointmentsModal, setAppointmentsModal] = useState(null);
  const { patients } = useSelector((state) => state.patients);
  const dispatch = useDispatch();

  if (!records || !records?.length) return null;

  const handleDelete = (id) => {
    DeleteAlert({
      hasLoading: true,
      text: 'The patient data will be permanently deleted.',
      confirmButtonText: 'Yes, delete patient',
      cancelButtonText: 'No, keep this patient',
      onConfirm: async () => {
        try {
          const response = await deletePatient(id);
          
          if (response.success) {
            if (Swal.isVisible()) Swal.close();

            dispatch(PatientsCreators.setPatients([...patients].filter(
              (pat) => pat.id.toString() !== id.toString())
            ));
            // setPatientsList(
            //   [...records].filter((pat) => pat.id.toString() !== id.toString())
            // );
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

  return (
    <>
      {appointmentsModal && (
        <PatientAppointmentsModal
          onClose={appointmentsModal.onClose}
          data={appointmentsModal.data}
          mode={appointmentsModal.mode}
        />
      )}
      <TableInfo
        title="Patients"
        message={getMessage()}
        addButton={{
          visible: true,
          value: 'Add Patient',
          title: 'Click to add a new patient',
          onClick: () => setPatientModal({ mode: 'include' }),
        }}
      />
      <Table>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">CPF</th>
            <th scope="col">Phone</th>
            <th scope="col">Birthdate</th>
            <th scope="col">City</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.name}</td>
              <td>{patient.cpf}</td>
              <td>{patient.phoneNumber}</td>
              <td>{new Date(patient.birthdate).toLocaleDateString()}</td>
              <td>{patient?.Address?.city || 'Not provided'}</td>
              <td>
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
                      data: patient,
                      mode: 'include',
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
              </td>
            </tr>
          ))
          }
        </tbody>
      </Table>
    </>
  );
};

export default PatientsList;
