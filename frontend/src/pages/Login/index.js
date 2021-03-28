import React, { useState } from 'react';
import { useDispatch} from 'react-redux';
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Form,
  FormGroup,
  Label,
  Row
} from 'reactstrap';
import { User, Lock } from 'react-feather';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';

import api from '../../services/api';
import styles from './Login.module.css';
import useYupValidationResolver from '../../utils/yupValidationResolver';
import { Creators as AuthActions } from '../../store/ducks/auth/reducer';
import CustomAlert from '../../components/UI/Alert';
import InvalidInputMessage from '../../components/UI/InvalidInputMessage';

const Login = ({ history }) => {
  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required('Username is required!')
      .max(18, 'Username is invalid!'),
    password: Yup.string()
      .required('Password is required!')
      .max(45, 'Password is invalid!')
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const resolver = useYupValidationResolver(validationSchema);
  const {
    // register,
    control,
    handleSubmit,
    errors,
  } = useForm({ resolver, mode: 'onBlur' });
  const [alert, setAlert] = useState(null);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    console.log(data);

    try {
      const response = await api.post('/session', data);

      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        dispatch(AuthActions.setUser({
          id: response.data.id,
          username: response.data.username,
          token: response.data.token,
        }));
        history.push('/');
      }
    } catch (error) {
      let message = 'Server Error';

      /** TO DO: Implement error handling... */
      if (error?.response) {
        if (error.response.status === 401) {
          message = error.response?.data?.message || 'Invalid Credentials';
        }

        if (error.response.status === 400) {
          message = error.response?.data?.message ||
            'Some fields require your attention';
        }
      }

      setIsSubmitting(false);
      setAlert(message);
    }
  };

  return (
    <Container
      fluid
      style={{ height: '100vh', backgroundColor: '#f3f4f7' }}
      className="d-flex justify-content-center align-items-center"
    >
      <Row className="w-100 d-flex justify-content-center">
        <Col>
          <Card className={styles.Card}>
            <CardBody className={styles.CardBody}>
              {!!alert && (
                <CustomAlert message={alert} type="danger" dismissible={false} />
              )}
              <Form onSubmit={handleSubmit(onSubmit)}>
                <FormGroup>
                  <div className="d-flex mb-1">
                    <User size="18" color="grey" />
                    <Label
                      className="m-0 ml-1 p-0 text-muted"
                      htmlFor="username"
                    >
                      Username
                    </Label>
                  </div>
                  <Controller
                    name="username"
                    control={control}
                    defaultValue=""
                    render={({ onChange, value }) => (
                      <Input
                        onChange={onChange}
                        value={value}
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Username"
                        className={errors.username ? 'is-invalid' : undefined}
                      />
                    )}
                  />
                  {errors.username &&
                    <InvalidInputMessage message={errors.username.message} />
                  }
                </FormGroup>

                <FormGroup>
                  <div className="d-flex mb-1">
                    <Lock size="18" color="grey" />
                    <Label
                      className="m-0 ml-1 p-0 text-muted"
                      htmlFor="password"
                    >
                      Password
                    </Label>
                  </div>
                  <Controller
                    name="password"
                    defaultValue=""
                    control={control}
                    render={({ onChange, value }) => (
                      <Input
                        type="password"
                        name="password"
                        id="password"
                        onChange={onChange}
                        value={value}
                        placeholder="Password"
                        className={errors.password ? 'is-invalid' : undefined}
                      />
                    )}
                  />
                  {errors.password &&
                    <InvalidInputMessage message={errors.password.message} />
                  }
                </FormGroup>

                <Button
                  type="submit"
                  title="Click to sign in"
                  disabled={isSubmitting}
                  className="btn-success btn-block mt-3"
                >
                  {isSubmitting ? 'Loading...' : 'Sign In'}
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
