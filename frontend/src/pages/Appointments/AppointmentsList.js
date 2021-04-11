import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';

import Table from '../../components/UI/Table';
import TableActions from '../../components/UI/Table/TableActions';
import { deleteAppointment } from '../../services/requests/appointments';
import { UNEXPECTED_ERROR_MSG } from '../../utils/contants';
import DeleteAlert from '../../components/UI/DeleteAlert';
import { Creators as PatientsActions } from '../../store/ducks/patients/reducer';
import { Creators as AppointmentsActions } from '../../store/ducks/appointments/reducer';

const AppointmentsList = ({ records, patientsTableId, setEditMode }) => {
  const dispatch = useDispatch();
  const { patients } = useSelector((state) => state.patients);
  const { appointments } = useSelector((state) => state.appointments);
  // const handleConfirm = (record) => {};

  if (!records) return null;

  const columns = [
    { name: 'Datetime', value: 'datetime', id: 1 },
    { name: 'Insurance', value: 'insurance', id: 2 },
    { name: 'Status', value: 'status', id: 3 },
  ];

  if (!patientsTableId) {
    columns.push({ name: 'Patient', value: 'patientName', id: 4 });
  }

  columns.push({ name: 'Actions', value: 'actions', id: 5 });

  // const handleEdit = async (record) => {
  //   try {
      
  //   } catch (error) {
  //     if (Swal.isVisible()) Swal.close();
  //     Swal.fire('Unexpected error', UNEXPECTED_ERROR_MSG, 'error');
  //   }
  // };

  const handleDelete = async (record) => {
    DeleteAlert({
      hasLoading: true,
      text: 'This appointment will be permanently deleted.',
      confirmButtonText: 'Yes, delete appointment',
      cancelButtonText: 'No, keep this appointment',
      onConfirm: async () => {
        try {
          const { success } = await deleteAppointment(record.id);

          if (success) {
            const patId = record?.Patient?.id.toString() ||
              record?.PatientId.toString();

            if (appointments) {
              dispatch(
                AppointmentsActions.setAppointments(
                  [...appointments].filter(
                    (appnt) => appnt.id?.toString() !== record.id?.toString())
                )
              );
            }

            if (patients) {
              dispatch(
                PatientsActions.setPatients(
                  [...patients].map((patient) => {
                    if (patient.id.toString() === patId) {
                      return {
                        ...patient,
                        Appointments: [...patient.Appointments].filter(
                          (appnt) => appnt.id.toString() !== record.id.toString()
                        )
                      };
                    }
  
                    return patient;
                  })
                )
              );
            }

            if (setEditMode) setEditMode(null);
            if (Swal.isVisible()) Swal.close();
          } else throw new Error();
        } catch (error) {
          if (Swal.isVisible()) Swal.close();
          Swal.fire('Unexpected error', UNEXPECTED_ERROR_MSG, 'error');
        }
      },
    });
  };

  const tableData = records.map((record) => ({
    keyRecord: record.id,
    patientName: record?.Patient?.name || 'Not Provided',
    datetime: record.datetime
      ? new Date(record.datetime).toLocaleString()
      : 'Not Provided',
    insurance: record?.Insurance?.name || 'None',
    status: record.isConfirmed ? 'Confirmed' : 'Not Confirmed',
    actions: (
      <TableActions
        check={{
          visible: true,
          title: 'Click to confirm this appointment',
          onClick: () => {},
          // onClick: () => setPatientModal({ appointment, mode: 'view' }),
        }}
        edit={{
          visible: true,
          title: 'Click to edit this appointment',
          onClick: () => {
            if (patientsTableId) {
              const editAppointmentForm = document.getElementById(
                'patient-modal-appointments'
              );

              if (editAppointmentForm) {
                editAppointmentForm.scrollIntoView();  
              }

              setEditMode(record);
            }
          },
          // onClick: () => setPatientModal({ appointment, mode: 'edit' }),
        }}
        del={{
          visible: true,
          title: 'Click to delete this appointment',
          onClick: () => handleDelete(record),
        }}
      />
    ),
  }));

  const getMessage = () => {
    if (patientsTableId) {
      return records.length
        ? "Here are all patient's appointments."
        : 'This patient does not have appointments yet.';
    }

    return records?.length
      ? 'Here are all your appointments. Please select or enter a date to filter them.'
      : 'You do not have appointments yet.';
  };

  return (
    <>
      <Table
        columns={columns}
        tableData={tableData.sort((a, b) => a - b)}
        tableId={patientsTableId || 'schedule-table'}
        tableInfo={{
          visible: true,
          // showDateInfo: !patientsTableId,
          hasSearch: {
            type: patientsTableId ? 'text' : 'date',
          },
          title: 'Appointments',
          message: getMessage(),
        }}
      />
    </>
  );
};

export default AppointmentsList;
