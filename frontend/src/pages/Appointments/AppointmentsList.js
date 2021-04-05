import React from 'react';

import Table from '../../components/UI/Table';
import TableActions from '../../components/UI/Table/TableActions';

const AppointmentsList = ({ records, patientsTableId }) => {
  // const handleDelete = (id) => {};
  // const handleConfirm = (record) => {};
  // const handleEdit = (record) => {};
  if (!records?.length) return null;

  const columns = [
    { name: 'Datetime', value: 'datetime', id: 1 },
    { name: 'Insurance', value: 'insurance', id: 2 },
    { name: 'Status', value: 'status', id: 3 },
  ];

  if (!patientsTableId) {
    columns.push({ name: 'Patient', value: 'patientName', id: 4 });
  }

  columns.push({ name: 'Actions', value: 'actions', id: 5 });

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
    ),
  }));

  return (
    <>
      <Table
        columns={columns}
        tableData={tableData}
        tableId={patientsTableId || 'schedule-table'}
        tableInfo={{
          visible: true,
          // showDateInfo: !patientsTableId,
          hasSearch: {
            type: patientsTableId ? 'text' : 'date',
          },
          title: 'Appointments',
          message: records?.length
            ? 'Here are all your appointments. Please select or enter a date to filter them.'
            : 'You do not have any appointments yet.',
        }}
      />
    </>
  );
};

export default AppointmentsList;
