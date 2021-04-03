import React from 'react';

import Table from '../../components/UI/Table';
import TableActions from '../../components/UI/Table/TableActions';

const AppointmentsList = ({ records }) => {
  // const [appointmentsModal, setAppointmentModal] = useState(null);

  // const handleDelete = (id) => {};

  if (!records?.length) return null;

  return (
    <>
      {/* {appointmentsModal && (
        <PatientAppointmentsModal
          onClose={appointmentsModal.onClose}
          data={appointmentsModal.data}
        />
      )} */}
      <Table>
        <thead>
          <tr>
            <th scope="col">Datetime</th>
            <th scope="col">Insurance</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((appointment) => (
            <tr key={appointment.id}>
              <td>{new Date(appointment.datetime).toLocaleString()}</td>
              <td>{appointment?.Insurance?.name || 'None'}</td>
              <td>{appointment.isConfirmed ? 'Confirmed' : 'Not Confirmed'}</td>
              <td>
                <TableActions
                  view={{
                    visible: true,
                    title: 'Click to view this appointment',
                    // onClick: () => setPatientModal({ appointment, mode: 'view' }),
                  }}
                  del={{
                    visible: true,
                    title: 'Click to delete this appointment',
                    // onClick: () => handleDelete(appointment.id),
                  }}
                  edit={{
                    visible: true,
                    title: 'Click to edit this appointment',
                    // onClick: () => setPatientModal({ appointment, mode: 'edit' }),
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

export default AppointmentsList;
