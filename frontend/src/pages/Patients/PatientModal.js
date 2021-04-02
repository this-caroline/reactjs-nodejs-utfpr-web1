import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row
} from 'reactstrap';
import Swal from 'sweetalert2';
import * as Yup from 'yup';

import ModalForm from '../../components/UI/Modal';
import RequiredLabel from '../../components/UI/RequiredLabel';
import InvalidInputMessage from '../../components/UI/InvalidInputMessage';
import useYupValidationResolver from '../../utils/yupValidationResolver';
import Toast from '../../components/UI/Toast';
import { INTERNAL_ERROR_MSG } from '../../utils/contants';
import {
  createPatient,
  // updatePatient,
} from '../../services/requests/patients';
import Select from '../../components/UI/Select';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Patient name is required!')
    .max(80, 'Patient name cannot be longer than 80 chars long!'),
  email: Yup.string()
    .email('You must provide a valid email!')
    .max(80, 'Email cannot be longer than 80 chars long!'),
  birthdate: Yup.string().required('Birthdate is required!'),
  cpf: Yup.string()
    .required('CPF is required!')
    .max(25, 'CPF cannot be longer than 25 chars long!'),
  gender: Yup.string().required('Gender is required!'),
  phoneNumber: Yup.string().required('Phone number is required!'),
  motherName: Yup.string()
    .required("Mother's name is required!")
    .max(80, "Mother's name cannot be longer than 80 chars long!"),
  // ADDRESS
  state: Yup.string()
    .required('State is required!')
    .max(2, 'State must be 2 chars!'),
  postal_code: Yup.string()
    .required('Postal code is required!')
    .max(15, 'This postal code is invalid!')
    .test(
      'postal-code-is-valid',
      'You must provide a valid postal code!',
      (value) => {
        if (!value) return false;

        const pattern = /^\d\d\d\d\d[-]?\d\d\d$/gm;

        if (pattern.test(value)) {
          return true;
        }

        return false;
      }
    ),
  street: Yup.string()
    .required('Street name is required!')
    .max(80, 'Street name cannot be longer than 50 chars long!'),
  number: Yup.number()
    .required('Number is required!')
    .typeError('Address number is invalid!'),
  complement: Yup.string()
    .max(80, 'Complement cannot be longer than 80 chars long!'),
  neighborhood: Yup.string()
    .required('Neighborhood is required!')
    .max(80, 'Neighborhood cannot be longer than 80 chars long!'),
});

const PatientModal = ({
  mode,
  data,
  onClose,
  patientsList,
  setPatientsList,
}) => {
  const { user } = useSelector((state) => state.auth);
  const [isSubmitting, setSubmitting] = useState(false);
  const [fetchingPostalCode, setFetchingPostalCode] = useState(false);
  const resolver = useYupValidationResolver(validationSchema);
  const {
    control,
    errors,
    handleSubmit,
    setError,
    setValue,
  } = useForm({ resolver, mode: 'onBlur' });

  const onSubmit = async (values) => {
    setSubmitting(true);

    // const payload = { ...values };

    try {
      console.log(data, values);

      const response = await createPatient({ ...values, UserId: user.userId });
      // const response = mode === 'include'
      //   ? await createPatient(payload)
      //   : await updatePatient(data.id, payload);

      if (response.success) {
        const updatedPatients = mode === 'include'
          ? [
              ...patientsList,
              {
                ...response.data.patient,
                User: { username: user.username },
              }]
          : [...patientsList].map((pat) => {
            if (pat.id.toString() === data.id.toString()) {
              return { ...response.data.patient };
            }

            return pat;
          });
        
        setPatientsList(updatedPatients);
        // dispatch(PatientsActions.setPatients(updatedPatients));
        onClose();
        Toast.fire({
          icon: 'success',
          title: `The patient was successfully ${mode === 'edit' ? 'updated' : 'registered'}!`,
        });
      } else throw new Error();
    } catch (error) {
      setSubmitting(false);
      Swal.fire({
        icon: 'error',
        title: 'Something went wrong!',
        text: INTERNAL_ERROR_MSG,
        confirmButtonText: 'Got it',
      });
    }
  };

  return (
    <ModalForm
      title={mode === 'edit' ? 'Edit Patient' : 'Include Patient'}
      subTitle="To include a new patient please fill in all the fields bellow."
      onClose={onClose}
      size="lg"
      body={
        <>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col>
                <FormGroup>
                  <RequiredLabel htmlFor="name">Name</RequiredLabel>
                  <Controller
                    name="name"
                    control={control}
                    defaultValue={data?.name || ''}
                    render={({ onChange, onBlur, value }) => (
                      <Input
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Patient Name"
                        className={errors.name ? 'is-invalid' : undefined}
                      />
                    )}
                  />
                  {errors.name &&
                    <InvalidInputMessage message={errors.name?.message} />
                  }
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormGroup>
                  <RequiredLabel htmlFor="gender">Gender</RequiredLabel>
                  <Controller
                    name="gender"
                    control={control}
                    defaultValue={data?.gender || ''}
                    render={({ onChange, onBlur, value }) => (
                      <Select
                        options={[
                          { value: 'Female', label: 'Female' },
                          { value: 'Male', label: 'Male' },
                          { value: 'Other', label: 'Other' },
                        ]}
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                        type="text"
                        name="gender"
                        id="gender"
                        placeholder="Gender"
                        hasError={!!errors.gender}
                      />
                    )}
                  />
                  {errors.gender &&
                    <InvalidInputMessage message={errors.gender?.message} />
                  }
                </FormGroup>
              </Col>

              <Col xl={6}>
                <FormGroup>
                  <RequiredLabel htmlFor="birthdate">Birthdate</RequiredLabel>
                  <Controller
                    name="birthdate"
                    control={control}
                    defaultValue={data?.birthdate || ''}
                    render={({ onChange, onBlur, value }) => (
                      <Input
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                        type="date"
                        name="birthdate"
                        id="birthdate"
                        placeholder="Birthdate"
                        className={errors.birthdate ? 'is-invalid' : undefined}
                      />
                    )}
                  />
                  {errors.birthdate &&
                    <InvalidInputMessage message={errors.birthdate?.message} />
                  }
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormGroup>
                  <Label htmlFor="email">Email</Label>
                  <Controller
                    name="email"
                    control={control}
                    defaultValue={data?.email || ''}
                    render={({ onChange, onBlur, value }) => (
                      <Input
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                        type="text"
                        name="email"
                        id="email"
                        placeholder="Email"
                        className={errors.email ? 'is-invalid' : undefined}
                      />
                    )}
                  />
                  {errors.email &&
                    <InvalidInputMessage message={errors.email?.message} />
                  }
                </FormGroup>
              </Col>

              <Col>
                <FormGroup>
                  <RequiredLabel htmlFor="cpf">CPF</RequiredLabel>
                  <Controller
                    name="cpf"
                    control={control}
                    defaultValue={data?.cpf || ''}
                    render={({ onChange, onBlur, value }) => (
                      <Input
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                        type="text"
                        name="cpf"
                        id="cpf"
                        placeholder="CPF"
                        className={errors.cpf ? 'is-invalid' : undefined}
                      />
                    )}
                  />
                  {errors.cpf &&
                    <InvalidInputMessage message={errors.cpf?.message} />
                  }
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormGroup>
                  <RequiredLabel htmlFor="motherName">Mother's Name</RequiredLabel>
                  <Controller
                    name="motherName"
                    control={control}
                    defaultValue={data?.motherName || ''}
                    render={({ onChange, onBlur, value }) => (
                      <Input
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                        type="text"
                        name="motherName"
                        id="motherName"
                        placeholder="Mother's Name"
                        className={errors.motherName ? 'is-invalid' : undefined}
                      />
                    )}
                  />
                  {errors.motherName &&
                    <InvalidInputMessage message={errors.motherName?.message} />
                  }
                </FormGroup>
              </Col>

              <Col>
                <FormGroup>
                  <RequiredLabel htmlFor="phoneNumber">Phone Number</RequiredLabel>
                  <Controller
                    name="phoneNumber"
                    control={control}
                    defaultValue={data?.phoneNumber || ''}
                    render={({ onChange, onBlur, value }) => (
                      <Input
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                        type="text"
                        name="phoneNumber"
                        id="phoneNumber"
                        placeholder="Phone Number"
                        className={errors.phoneNumber ? 'is-invalid' : undefined}
                      />
                    )}
                  />
                  {errors.phoneNumber &&
                    <InvalidInputMessage message={errors.phoneNumber?.message} />
                  }
                </FormGroup>
              </Col>
            </Row>

            <h4 className="mt-3 mb-4">Patient Address</h4>
            
            <Row>
              <Col>
                <FormGroup>
                  <RequiredLabel htmlFor="country">Country</RequiredLabel>
                  <Controller
                    name="country"
                    control={control}
                    defaultValue={data?.country || ''}
                    render={() => (
                      <Input
                        readOnly
                        disabled
                        value="Brazil"
                        type="text"
                        name="country"
                        id="country"
                        placeholder="Country"
                      />
                    )}
                  />
                </FormGroup>
              </Col>

              <Col>
                <FormGroup>
                  <RequiredLabel htmlFor="postal_code">
                    Postal Code {fetchingPostalCode && (
                      <div
                        className="spinner-border text-primary spinner-border-sm"
                        role="status"
                      />
                    )}
                  </RequiredLabel>
                  <Controller
                    name="postal_code"
                    control={control}
                    defaultValue={data?.postal_code || ''}
                    render={({ onBlur, onChange, value }) => (
                      <Input
                        onChange={onChange}
                        value={value}
                        max={9}
                        type="text"
                        name="postal_code"
                        id="postal_code"
                        placeholder="e.g. 35970000"
                        onBlur={async (e) => {
                          if (!e.target.value) return null;

                          const pattern = /^\d\d\d\d\d[-]?\d\d\d$/gm;

                          if (pattern.test(e.target.value)) {
                            setFetchingPostalCode(true);

                            try {
                              const url =
                                `https://viacep.com.br/ws/${e.target.value}/json/`;
                              const response = await (await fetch(url)).json();
                              
                              if (response.erro) throw new Error();

                              setValue('state', response?.uf || '');
                              setValue('city', response?.localidade || '');
                              setValue('neighborhood', response?.bairro || '');
                              setValue('street', response?.logradouro || '');
                            } catch (error) {
                              setValue('state', '');
                              setValue('city', '');
                              setFetchingPostalCode(false);

                              return setError('postal_code', {
                                type: 'manual',
                                message: 'Invalid postal code!'
                              });
                            };
                          }

                          setFetchingPostalCode(false);
                          return onBlur(e);
                        }}
                        className={errors.postal_code ? 'is-invalid' : undefined}
                      />
                    )}
                  />
                  {errors.postal_code &&
                    <InvalidInputMessage message={errors.postal_code?.message} />
                  }
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormGroup>
                  <RequiredLabel htmlFor="state">State</RequiredLabel>
                  <Controller
                    name="state"
                    control={control}
                    defaultValue={data?.state || ''}
                    render={({ value }) => (
                      <Input
                        readOnly
                        disabled
                        value={value}
                        type="text"
                        name="state"
                        id="state"
                        placeholder="State"
                      />
                    )}
                  />
                  {errors.state &&
                    <InvalidInputMessage message={errors.state?.message} />
                  }
                </FormGroup>
              </Col>

              <Col xl={6}>
                <FormGroup>
                  <RequiredLabel htmlFor="city">City</RequiredLabel>
                  <Controller
                    name="city"
                    control={control}
                    defaultValue={data?.city || ''}
                    render={({ value }) => (
                      <Input
                        readOnly
                        disabled
                        value={value}
                        type="text"
                        name="city"
                        id="city"
                        placeholder="City"
                      />
                    )}
                  />
                  {errors.city &&
                    <InvalidInputMessage message={errors.city?.message} />
                  }
                </FormGroup>
              </Col>
            </Row>
            
            <Row>
              <Col>
                <FormGroup>
                  <RequiredLabel htmlFor="street">Street</RequiredLabel>
                  <Controller
                    name="street"
                    control={control}
                    defaultValue={data?.street || ''}
                    render={({ onBlur, onChange, value }) => (
                      <Input
                        onBlur={onBlur}
                        onChange={onChange}
                        value={value}
                        type="text"
                        name="street"
                        id="street"
                        placeholder="Street"
                      />
                    )}
                  />
                  {errors.street &&
                    <InvalidInputMessage message={errors.street?.message} />
                  }
                </FormGroup>
              </Col>

              <Col xl={6}>
                <FormGroup>
                  <RequiredLabel htmlFor="number">Number</RequiredLabel>
                  <Controller
                    name="number"
                    control={control}
                    defaultValue={data?.number || ''}
                    render={({ onBlur, onChange, value }) => (
                      <Input
                        onBlur={onBlur}
                        onChange={onChange}
                        value={value}
                        type="text"
                        name="number"
                        id="number"
                        placeholder="Number"
                      />
                    )}
                  />
                  {errors.number &&
                    <InvalidInputMessage message={errors.number?.message} />
                  }
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormGroup>
                  <Label htmlFor="complement">Complement</Label>
                  <Controller
                    name="complement"
                    control={control}
                    defaultValue={data?.complement || ''}
                    render={({ onBlur, onChange, value }) => (
                      <Input
                        onBlur={onBlur}
                        onChange={onChange}
                        value={value}
                        type="text"
                        name="complement"
                        id="complement"
                        placeholder="Complement"
                      />
                    )}
                  />
                  {errors.complement &&
                    <InvalidInputMessage message={errors.complement?.message} />
                  }
                </FormGroup>
              </Col>

              <Col xl={6}>
                <FormGroup>
                  <RequiredLabel htmlFor="neighborhood">Neighborhood</RequiredLabel>
                  <Controller
                    name="neighborhood"
                    control={control}
                    defaultValue={data?.neighborhood || ''}
                    render={({ onBlur, onChange, value }) => (
                      <Input
                        onBlur={onBlur}
                        onChange={onChange}
                        value={value}
                        type="text"
                        name="neighborhood"
                        id="neighborhood"
                        placeholder="Neighborhood"
                      />
                    )}
                  />
                  {errors.neighborhood &&
                    <InvalidInputMessage message={errors.neighborhood?.message} />
                  }
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
                  `Click to ${mode === 'edit' ? 'edit' : 'include'} this patient`
                }
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </Container>
          </Form>          
        </>
      }
    />
  );
};

export default PatientModal;
