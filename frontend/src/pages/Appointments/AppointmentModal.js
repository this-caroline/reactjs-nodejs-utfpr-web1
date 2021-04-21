import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, FormGroup, Input, Row } from 'reactstrap';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import dayjs, { utc } from 'dayjs';
import Swal from 'sweetalert2';
import * as Yup from 'yup';

import ModalForm from '../../components/UI/Modal';
import Toast from '../../components/UI/Toast';
import InvalidInputMessage from '../../components/UI/InvalidInputMessage';
import RequiredLabel from '../../components/UI/RequiredLabel';
import Select from '../../components/UI/Select';
import LoadingPage from '../../components/UI/LoadingPage';
import { getInsurances } from '../../utils/insurances';
import useYupValidationResolver from '../../utils/yupValidationResolver';
import { Creators as InsurancesActions } from '../../store/ducks/insurances/reducer';
import { Creators as AppointmentsActions } from '../../store/ducks/appointments/reducer';
// import { Creators as PatientsActions } from '../../store/ducks/patients/reducer';
import { createAppointment, updateAppointment } from '../../services/requests/appointments';
import { INTERNAL_ERROR_MSG } from '../../utils/contants';

dayjs.extend(utc);

const validationSchema = Yup.object().shape({
  date: Yup.string().required('Appointment date is required!'),
  time: Yup.string().required('Appointment time is required!'),
  insurance: Yup.string().nullable(true),
});

const AppointmentModal = ({ data, onClose, mode }) => {
  const dispatch = useDispatch();
  const { appointments } = useSelector((state) => state.appointments);
  const { patients } = useSelector((state) => state.patients);
  const insurances = useSelector((state) => state.insurances);
  const [isSubmitting, setSubmitting] = useState(false);
  const resolver = useYupValidationResolver(validationSchema);
  const {
    control,
    errors,
    handleSubmit,
    setError,
    reset,
  } = useForm({ resolver, mode: 'onBlur' });

  useEffect(() => {
    setTimeout(() => {
      dispatch(InsurancesActions.fetchInsurances());
      // dispatch(PatientsActions.fetchPatients());
    }, 1500);
  }, [dispatch]);

  const onSubmit = async (values) => {
    setSubmitting(true);

    const insId = parseInt(values.insurance);
    const payload = {
      datetime: `${dayjs.utc(values.date).format('YYYY-MM-DD')} ${values.time}:00`,
      isConfirmed: false,
      InsuranceId: ['NaN', NaN].includes(insId) ? null : insId,
      PatientId: mode === 'new' ? values.name : data.PatientId,
    };

    const response = mode === 'new'
      ? await createAppointment(payload)
      : await updateAppointment(data.id, payload);

    if (response.success) {
      if (mode === 'new') {
        dispatch(
          AppointmentsActions.setAppointments([
            ...appointments,
            {
              ...response.data?.appointment,
              Insurance: values.insurance
                ? {
                    name: getInsurances(insurances?.insurances)
                      .find((ins) =>
                        ins?.value?.toString() === values?.insurance?.toString()
                      )?.label,
                    id: ['NaN', NaN, ''].includes(insId) ? null : insId,
                  }
                : null,
            }
          ])
        );
      } else {
        dispatch(
          AppointmentsActions.setAppointments(
            [...appointments].map((appnt) => {
              if (appnt.id?.toString() === data.id?.toString()) {
                return {
                  ...data,
                  ...response.data?.appointment,
                  Insurance: values.insurance
                    ? {
                        name: getInsurances(insurances?.insurances)
                          .find((ins) =>
                            ins?.value?.toString() === values?.insurance?.toString()
                          )?.label,
                        id: ['NaN', NaN, ''].includes(insId) ? null : insId,
                      }
                    : null,
                };
              }
  
              return appnt;
            })
          )
        );
      }

      Toast.fire({
        title: mode === 'new'
          ? 'The appointment was successfully registered!'
          : 'The appointment was successfully updated!',
        icon: 'success',
      });
      onClose();
    } else {
      setSubmitting(false);

      if (response?.status === 400 && response?.field === 'time') {
        return setError('time', {
          type: 'manual',
          message: response.error,
        });
      }

      Swal.fire('Something went wrong!', INTERNAL_ERROR_MSG, 'error');
    };
  };

  const formattedPatients = patients
    ? [...patients].map((pat) => ({
        label: pat.name,
        value: pat.id,
      }))
    : [];

  return (
    <ModalForm
      title={mode === 'new' ? 'New Appointment' : 'Edit Appointment'}
      subTitle={
        mode === 'new'
          ? 'Please fill in the fields below to make a new appointment.'
          : 'Please fill in the fields below to edit this appointment.'
      }
      onClose={onClose}
      size="lg"
      body={!insurances.insurances || !patients
        ? <LoadingPage className="mb-3" message="Please wait. Loading data..." />
        : (
          <Form onSubmit={handleSubmit(onSubmit)} id="patient-modal-appointments">
            <Row>
              <Col>
                <FormGroup>
                  <RequiredLabel htmlFor="name">Name</RequiredLabel>
                  <Controller
                    name="name"
                    control={control}
                    defaultValue={mode === 'new'
                      ? formattedPatients?.[0].value
                      : data?.Patient?.name || ''
                    }
                    render={({ onBlur, onChange, value }) => mode === 'new' ? (
                      <Select
                        options={patients ? formattedPatients : []}
                        onBlur={onBlur}
                        onChange={onChange}
                        value={value}
                        name="name"
                        id="name"
                        placeholder="Patient's name"
                        hasError={!!errors.name}
                      />
                    ) : (
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
                    defaultValue={data?.Insurance?.id || ''}
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
                    defaultValue={data?.datetime?.split('T')?.[0] || ''}
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
                    defaultValue={
                      new Date(data?.datetime)
                        .toLocaleTimeString()
                        .split('')
                        .slice(0, 5).join('') || ''
                    }
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
                onClick={() => {
                  reset();
                  return onClose();
                }}
                disabled={isSubmitting}
                outline
              >
                {mode === 'new' ? 'Cancel' : 'Cancel Editing'}
              </Button>

              <Button
                color="success"
                type="submit"
                size="md"
                className="width-lg ml-2 pl-4 pr-4"
                title="Click to edit this appointment"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </Container>
          </Form>
      )}
    />
  );
};

export default AppointmentModal;
