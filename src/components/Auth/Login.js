import React, { useContext } from 'react';
import { Container, Card, CardContent, TextField, Button} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../../context/AuthContext'; // Import the AuthContext

export default function Login() {
  const { login } = useContext(AuthContext); // Access the login function from AuthContext

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Required').email('Invalid email'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      login(values.email, values.password);
    },
  });

  return (
    <Container>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px'}}>
        <Card style={{ width: '100%', maxWidth: '500px' }}>
          <CardContent>
            <h4>Login</h4>
            <form onSubmit={formik.handleSubmit}>
              <TextField
                id="email"
                label="Email"
                fullWidth
                margin="normal"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && formik.errors.email}
                helperText={formik.touched.email && formik.errors.email}
              />

              <TextField
                id="password"
                label="Password"
                fullWidth
                margin="normal"
                name="password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && formik.errors.password}
                helperText={formik.touched.password && formik.errors.password}
              />

              <Button variant="contained" color="primary" type="submit">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
