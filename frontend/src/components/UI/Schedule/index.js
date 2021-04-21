import React, { useCallback, useEffect, useState } from 'react';
import { Col, Input, Row } from 'reactstrap';
import { Controller, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

import styles from './Schedule.module.css';
import TableActions from '../Table/TableActions';
import { fetchAppointments } from '../../../services/requests/appointments';
import { INTERNAL_ERROR_MSG } from '../../../utils/contants';
import { Creators as AppointmentsActions } from '../../../store/ducks/appointments/reducer';
// import { Creators as PatientsActions } from '../../../store/ducks/patients/reducer';
import LoadingPage from '../LoadingPage';
import { useDispatch, useSelector } from 'react-redux';
import AppointmentModal from '../../../pages/Appointments/AppointmentModal';

const columns = [
  { name: 'Time', value: 'datetime' },
  { name: 'Insurance', value: 'insurance' },
  { name: 'Status', value: 'status' },
  { name: 'Patient', value: 'patientName' },
  { name: 'Actions', value: 'actions' },
];
const times = [
  '07:00:00',
  '07:30:00',
  '08:00:00',
  '08:30:00',
  '09:00:00',
  '09:30:00',
  '10:00:00',
  '10:30:00',
  '11:00:00',
  '11:30:00',
  '12:00:00',
  '12:30:00',
  '13:00:00',
  '13:30:00',
  '14:00:00',
  '14:30:00',
  '15:00:00',
  '15:30:00',
  '16:00:00',
  '16:30:00',
  '17:00:00',
  '17:30:00',
  '18:00:00',
  '18:30:00',
  '19:00:00',
  '19:30:00',
];

const Schedule = (props) => {
  const {
    records,
    patients,
    formatTableData,
    className,
    ...rest
  } = props;
  const { control } = useForm({ mode: 'onBlur' });
  const [loading, setLoading] = useState(false);
  const [appointmentModal, setAppointmentModal] = useState(null);

  const getAppointmentStatusClassName = (stts) => {
    if (['confirmed', 'checked', 'confirmado'].includes(stts.toLowerCase())) {
      return styles.Confirmed;
    }

    return styles.Pending;
  };

  const getSchedule = useCallback((data) => times.map((time) => {
    let matchedRecord = null;
    const matched = data.some((record) => {
      const appointmentTime = new Date(record.pureDatetime)
      .toLocaleTimeString()
      // .split(':')
      // .slice(0, 2);

      matchedRecord = record;
      return time === (appointmentTime);
    });

    if (matched) {
      return {
        ...matchedRecord,
        status: (
          <span
            className={`${styles.Status} ${getAppointmentStatusClassName(matchedRecord.status)}`}
          >
            {matchedRecord.status || 'None'}
          </span>
        ),
      };
    }

    matchedRecord = null;

    return {
      datetime: time,
      insurance: '', //'N/A',
      keyRecord: time,
      patientName: '', //'N/A',
      pureDatetime: null,
      status: (
        <span className={`${styles.Free} ${styles.Status}`}>Free</span>
      ),
      actions: (
        <TableActions
          add={{
            visible: true,
            onClick: () => setAppointmentModal({ data: { time } }),
            title:  'Click to make a new appointment'
          }}
        />
      )
    };
  }), []);
  const { date } = useSelector((state) => state.appointments);
  const dispatch = useDispatch();
  // const { patients } = useSelector((state) => state.patients);
  const [appointments, setAppointments] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await fetchAppointments(date);

      if (response.success) {
        const schedule = getSchedule(
          formatTableData(response?.data?.appointments, false)
        );

        setAppointments(schedule);
        setIsReady(true);
      } else {
        setIsReady('error');
      }
    })();

    return () => { 
      setAppointments(null);
      setIsReady(false);
    }
  }, [date, formatTableData, getSchedule]);

  // useEffect(() => {
  //   console.log('vou despachar patients...');
  //   dispatch(PatientsActions.fetchPatients());
  // }, [dispatch]);

  if (isReady === 'error') return <h2>{INTERNAL_ERROR_MSG}</h2>;

  return (
    <div className="table-responsive w-100">
      {!!appointmentModal && (
        <AppointmentModal
          mode="new"
          data={appointmentModal.data}
          onClose={() => setAppointmentModal(null)}
        />
      )}
      <Row className="mr-2">
        <Col>
          <h3
            style={{ color: '#515151' }}
            className="font-weight-bold h5 mb-1"
          >
            Schedule
          </h3>
          <p className="text-muted">
            Please select a date to see your appointments.
          </p>
        </Col>
      </Row>

      <Controller
        name="searchInput"
        control={control}
        defaultValue={date}
        render={({ value, onChange }) => (
          <Input
            type="date"
            value={value}
            name="searchInput"
            id="searchInput"
            disabled={!isReady || !patients}
            style={{ width: 280 }}
            placeholder="Date"
            className="form-control mb-3"
            onChange={async (e) => {
              if (e.target.value) {
                onChange(e);
                setLoading(true);
                dispatch(AppointmentsActions.setDate(e.target.value));

                const response = await fetchAppointments(e.target.value);

                setLoading(false);
                if (response.success) {
                  // console.log('response:', response.data?.appointments);
                  const schedule = getSchedule(
                    formatTableData(response?.data?.appointments, false)
                  );

                  setAppointments(schedule);
                } else {
                  Swal.fire('Internal Error', INTERNAL_ERROR_MSG, 'error');
                }
              }
              
              return null;
            }}
          />
        )}
      />
      {isReady ?
        (
          <table
            className={`${styles.Table} ${className || ''} table table-hover`}
            {...rest}
          >
            <>
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column.value} scope="col">
                      <div className="d-flex">{column.name}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading
                  ? (
                    <tr>
                      <td colSpan="75%">Please wait. Loading appointments...</td>
                    </tr>
                  )
                  : (
                    appointments?.map((record) => (
                      <tr key={record.datetime}>
                        {columns.map((col) => (
                          <td key={col.value}>{record[col.value]}</td>
                        ))}
                      </tr>
                    ))
                  )
                }
              </tbody>
            </>
          </table>
        )
        :
        (
          <LoadingPage
            align="start"
            message="Please wait. Loading appointments..."
          />
        )
      }
    </div>
  );
};

export default Schedule;
