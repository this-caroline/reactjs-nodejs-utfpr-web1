import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { Button, Col, Container, Form, FormGroup, Input, Row } from 'reactstrap';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Swal from 'sweetalert2';
import * as Yup from 'yup';

import ModalForm from '../../components/UI/Modal';
import useYupValidationResolver from '../../utils/yupValidationResolver';
import RequiredLabel from '../../components/UI/RequiredLabel';
import InvalidInputMessage from '../../components/UI/InvalidInputMessage';
import Select from '../../components/UI/Select';
import LoadingPage from '../../components/UI/LoadingPage';
import AppointmentsList from '../Appointments/AppointmentsList';
import { Creators as PatientsActions } from '../../store/ducks/patients/reducer';
import {
  createAppointment,
  updateAppointment,
} from '../../services/requests/appointments';
import { INTERNAL_ERROR_MSG } from '../../utils/contants';
import Toast from '../../components/UI/Toast';

dayjs.extend(utc);

const validationSchema = Yup.object().shape({
  date: Yup.string().required('Appointment date is required!'),
  time: Yup.string().required('Appointment time is required!'),
  insurance: Yup.string().nullable(true),
});

const getInsurances = (insurances) => {
  if (!insurances || !insurances?.length) return [];

  const insList = [...insurances].map((ins) => ({
    label: ins.name,
    value: ins.id,
  }));

  insList.unshift({ label: 'None', value: null });

  return insList;
}; 

const PatientAppointmentsModal = ({ onClose, data, mode }) => {
  const dispatch = useDispatch();
  const { patients } = useSelector((state) => state.patients);
  const insurances = useSelector((state) => state.insurances);
  const appointments = patients.find(
    (patient) => patient.id === data.id
  )?.Appointments;
  const resolver = useYupValidationResolver(validationSchema);
  const [isSubmitting, setSubmitting] = useState(false);
  const {
    control,
    errors,
    handleSubmit,
  } = useForm({ resolver, mode: 'onBlur' });

  const onSubmit = async (values) => {
    setSubmitting(true);

    const payload = {
      datetime: `${dayjs.utc(values.date).format('YYYY-MM-DD')} ${values.time}:00`,
      isConfirmed: false,
      InsuranceId: values.insurance,
      PatientId: data.id,
    };

    const response = mode === 'edit'
      ? await updateAppointment(0, payload) // implement the correct way...
      : await createAppointment(payload);

    if (response.success) {
      if (mode === 'include') {
        const updatedPatients = [...patients].map((pat) => {
          if (pat.id === data.id) {
            return {
              ...pat,
              Appointments: [
                ...pat.Appointments,
                {
                  ...response.data?.appointment,
                  Insurance: values.insurance ?
                    {
                      name: getInsurances(insurances?.insurances)
                        .find((ins) =>
                          ins?.value?.toString() === values?.insurance?.toString()
                        )?.label,
                      id: parseInt(values.insurance),
                    }
                  : null,
                }
              ]
            };
          }

          return pat;
        });

        dispatch(PatientsActions.setPatients(updatedPatients));
      }
      // const updatedAppointments = data?.Appointments?.map((appointment) => {
      //   if (appointment.id === )
      // });

      Toast.fire({
        title: mode === 'edit'
          ? 'The appointment was successfully updated!'
          : 'The appointment was successfully registered!',
        icon: 'success',
      });
      onClose();
    } else {
      Swal.fire('Something went wrong!', INTERNAL_ERROR_MSG, 'error');
      setSubmitting(false);
    }
  };

  const getAppointmentsGrid = () => {
    return (
      <>
        <div className="table-responsive">
          <AppointmentsList
            // records={data?.Appointments}
            records={appointments}
            patientsTableId="patients-appointments-table"
          />
        </div>

        <Form onSubmit={handleSubmit(onSubmit)}>
          {!!appointments?.length && (
            <h4 className="mb-4 mt-5">
              {mode === 'include' ? 'Include' : 'Edit'} Appointment
            </h4>
          )}
          <Row>
            <Col>
              <FormGroup>
                <RequiredLabel htmlFor="name">Name</RequiredLabel>
                <Controller
                  name="name"
                  control={control}
                  defaultValue={data?.name || 'Not Provided'}
                  render={({ onBlur, onChange, value }) => (
                    <Input
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      readOnly
                      disabled
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Patient's name"
                      className={errors.name ? 'is-invalid' : undefined}
                    />
                  )}
                />
                {errors.name && (
                  <InvalidInputMessage message={errors.name?.message} />
                )}
              </FormGroup>
            </Col>

            <Col>
              <FormGroup>
                <RequiredLabel htmlFor="insurance">Insurance</RequiredLabel>
                <Controller
                  name="insurance"
                  control={control}
                  defaultValue={data?.InsuranceId || ''}
                  render={({ onBlur, onChange, value }) => (
                    <Select
                      options={getInsurances(insurances?.insurances)}
                      onBlur={onBlur}
                      onChange={onChange}
                      value={value}
                      name="insurance"
                      id="insurance"
                      placeholder="Insurance"
                      hasError={!!errors.insurance}
                    />
                  )}
                />
                {errors.insurance && (
                  <InvalidInputMessage message={errors.insurance?.message} />
                )}
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col>
              <FormGroup>
                <RequiredLabel htmlFor="date">Appointment Date</RequiredLabel>
                <Controller
                  name="date"
                  control={control}
                  defaultValue={data?.datetime || ''}
                  render={({ onBlur, onChange, value }) => (
                    <Input
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      type="date"
                      name="date"
                      id="date"
                      placeholder="Date"
                      className={errors.date ? 'is-invalid' : undefined}
                    />
                  )}
                />
                {errors.date && (
                  <InvalidInputMessage message={errors.date?.message} />
                )}
              </FormGroup>
            </Col>

            <Col xl={6}>
              <FormGroup>
                <RequiredLabel htmlFor="time">Appointment Time</RequiredLabel>
                <Controller
                  name="time"
                  control={control}
                  defaultValue={data?.time || ''}
                  render={({ onBlur, onChange, value }) => (
                    <Input
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      type="time"
                      name="time"
                      id="time"
                      placeholder="Time"
                      className={errors.time ? 'is-invalid' : undefined}
                    />
                  )}
                />
                {errors.time && (
                  <InvalidInputMessage message={errors.time?.message} />
                )}
              </FormGroup>
            </Col>
          </Row>

          <Container className="mt-4 mb-3 d-flex justify-content-center flex-wrap">
            <Button
              color="primary"
              type="button"
              className="width-lg pl-4 pr-4"
              title="Click to cancel and discard all changes"
              onClick={() => onClose()}
              disabled={isSubmitting}
              outline
            >
              Cancel
            </Button>

            <Button
              color="success"
              type="submit"
              size="md"
              className="width-lg ml-2 pl-4 pr-4"
              title={
                `Click to ${mode === 'edit' ? 'edit' : 'include'} this appointment`
              }
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </Container>
        </Form>
      </>
    );
  };

  if (insurances.loading) {
    return <LoadingPage />;
  }

  return (
    <ModalForm
      title="Manage Appointments"
      subTitle={data?.appointments?.length
        ? 'These are all appointments of this patient.'
        : ''
      }
      onClose={onClose}
      size="lg"
      body={getAppointmentsGrid()}
    />
  );
};

export default PatientAppointmentsModal;
