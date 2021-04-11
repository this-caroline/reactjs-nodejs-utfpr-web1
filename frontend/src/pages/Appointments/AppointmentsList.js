import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import Table from '../../components/UI/Table';
import TableActions from '../../components/UI/Table/TableActions';
import {
  deleteAppointment,
  updateAppointment,
} from '../../services/requests/appointments';
import { UNEXPECTED_ERROR_MSG } from '../../utils/contants';
import ConfirmAlert from '../../components/UI/ConfirmAlert';
import { Creators as PatientsActions } from '../../store/ducks/patients/reducer';
import { Creators as AppointmentsActions } from '../../store/ducks/appointments/reducer';
import AppointmentModal from './AppointmentModal';

dayjs.extend(utc);

const AppointmentsList = ({ records, patientsTableId, setEditMode }) => {
  const dispatch = useDispatch();
  const { appointments } = useSelector((state) => state.appointments);
  const { patients } = useSelector((state) => state.patients);
  const [appointmentModal, setAppointmentModal] = useState(null);

  if (!records || !appointments) return null;

  const columns = [
    { name: 'Datetime', value: 'datetime', id: 1 },
    { name: 'Insurance', value: 'insurance', id: 2 },
    { name: 'Status', value: 'status', id: 3 },
  ];

  if (!patientsTableId) {
    columns.push({ name: 'Patient', value: 'patientName', id: 4 });
  }

  columns.push({ name: 'Actions', value: 'actions', id: 5 });

  const handleConfirm = async (record) => {
    ConfirmAlert({
      hasLoading: true,
      text: "Once confirmed you'll no longer be able to edit or delete this appointment.",
      confirmButtonText: 'Confirm Appointment',
      cancelButtonText: 'Cancel',
      onConfirm: async () => {
        try {
          const date = dayjs.utc(record?.datetime?.split('T')?.[0]);
          const time = new Date(record?.datetime)
              .toLocaleTimeString()
              .split('')
              .slice(0, 5).join('');
          const payload = {
            datetime: `${date.format('YYYY-MM-DD')} ${time}:00`,
            isConfirmed: true,
            InsuranceId: record.InsuranceId,
            PatientId: record?.PatientId,
          };
          const response = await updateAppointment(record.id, payload);
    
          if (response.success) {
            if (patients) {
              dispatch(
                PatientsActions.setPatients(
                  [...patients].map((pat) => {
                    if (pat.id?.toString() === record?.PatientId?.toString()) {
                      return {
                        ...pat,
                        Appointments: [...pat?.Appointments].map((appt) => {
                          if (appt.id?.toString() === record.id?.toString()) {
                            return {
                              ...record,
                              isConfirmed: true,
                            };
                          }
          
                          return appt;
                        })
                      };
                    }
    
                    return pat;
                  })
                )
              );
            }
    
            if (appointments) {
              dispatch(
                AppointmentsActions.setAppointments(
                  [...appointments].map((appnt) => {
                    if (appnt.id?.toString() === record.id?.toString()) {
                      return { ...record, isConfirmed: true };
                    }
    
                    return appnt;
                  })
                )
              );
            }

            if (Swal.isVisible()) Swal.close();
          } else throw new Error();
        } catch (error) {
          if (Swal.isVisible()) Swal.close();
          Swal.fire('Unexpected error', UNEXPECTED_ERROR_MSG, 'error');
        }
      }
    });
  };

  const handleDelete = async (record) => {
    ConfirmAlert({
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
    actions: !record.isConfirmed ? (
      <TableActions
        check={{
          visible: !record.isConfirmed,
          title: 'Click to confirm this appointment',
          onClick: () => handleConfirm(record),
        }}
        edit={{
          visible: !record.isConfirmed,
          title: 'Click to edit this appointment',
          onClick: () => {
            if (patientsTableId) {
              const editAppointmentForm = document.getElementById(
                'patient-modal-appointments'
              );

              if (editAppointmentForm) {
                editAppointmentForm.scrollIntoView();  
              }

              return setEditMode(record);
            }

            return setAppointmentModal({
              data: record,
              onClose: () => setAppointmentModal(null),
            });
          },
        }}
        del={{
          visible: !record.isConfirmed,
          title: 'Click to delete this appointment',
          onClick: () => handleDelete(record),
        }}
      />
    ) : 'No Actions',
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
      {appointmentModal && (
        <AppointmentModal
          data={appointmentModal.data}
          onClose={appointmentModal.onClose}
        /> 
      )}
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
