import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { Button, Container, Form, FormGroup, Input } from 'reactstrap';
import Swal from 'sweetalert2';
import * as Yup from 'yup';

import useYupValidationResolver from '../../utils/yupValidationResolver';
import InvalidInputMessage from '../../components/UI/InvalidInputMessage';
import ModalForm from '../../components/UI/Modal';
import RequiredLabel from '../../components/UI/RequiredLabel';
import Toast from '../../components/UI/Toast';
import { Creators as InsurancesActions } from '../../store/ducks/insurances/reducer';
import {
  createInsurance,
  updateInsurance,
} from '../../services/requests/insurances';
import { INTERNAL_ERROR_MSG } from '../../utils/contants';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Insurance name is required!')
    .max(80, 'Insurance name cannot be longer than 80 characters long!'),
});

const InsuranceModal = ({ data, mode, onClose }) => {
  const auth = useSelector((state) => state.auth);
  const { insurances } = useSelector((state) => state.insurances);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const resolver = useYupValidationResolver(validationSchema);
  const [isSubmitting, setSubmitting] = useState(false);
  const {
    control,
    handleSubmit,
    errors,
  } = useForm({ resolver, mode: 'onBlur' });

  const onSubmit = async ({ name, phone }) => {
    setSubmitting(true);

    const payload = { name, UserId: auth?.user.userId, phone };

    try {
      const response = mode === 'include'
        ? await createInsurance(payload)
        : await updateInsurance(data.id, payload);

      if (response.success) {
        const updatedInsurances = mode === 'include'
          ? [
              ...insurances,
              {
                ...response.data.insurance,
                User: { username: user.username },
              }]
          : [...insurances].map((ins) => {
            if (ins.id.toString() === data.id.toString()) {
              return { ...response.data.insurance };
            }

            return ins;
          });

        dispatch(InsurancesActions.setInsurances(updatedInsurances));
        onClose();
        Toast.fire({
          icon: 'success',
          title: `The insurance was successfully ${mode === 'edit' ? 'updated' : 'registered'}!`,
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
      title={mode === 'edit' ? 'Edit Insurance' : 'Include Insurance'}
      subTitle="Please fill in the insurance name."
      onClose={onClose}
      size="md"
      body={
        <>
          <Form onSubmit={handleSubmit(onSubmit)}>
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
                    placeholder="Insurance Name"
                    className={errors.name ? 'is-invalid' : undefined}
                  />
                )}
              />
              {errors.name &&
                <InvalidInputMessage message={errors.name?.message} />
              }
              <RequiredLabel htmlFor="phone">Telefone de contato</RequiredLabel>
              <Controller
                name="phone"
                control={control}
                defaultValue={data?.phone || ''}
                render={({ onChange, onBlur, value }) => (
                  <Input
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    type="text"
                    name="phone"
                    id="phone"
                    placeholder="Insurance phone"
                    className={errors.name ? 'is-invalid' : undefined}
                  />
                )}
              />
              {errors.phone &&
                <InvalidInputMessage message={errors.phone?.message} />
              }
            </FormGroup>
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
                title={`Click to ${mode === 'edit' ? 'edit' : 'create'} this insurance`}
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

export default InsuranceModal;
