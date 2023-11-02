import React from 'react';
import { Container, Card, CardContent, TextField, Button} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues:{
      fullName:"",
      email:"",
      image:"",
      password:""
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Required").min(2, "Must be 2 characters or more"),
      email: Yup.string().required("Required").email("Invalid email"),
      image: Yup.string().required("Required").url("Invalid url"),
      password: Yup.string().required("Required").min(6, "Must be 6 characters or more")
    }),
    onSubmit: (values) => {
      registerUser(values);
    }
  });

  const registerUser = async (userData) => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        // Registration successful
        alert('Registration successful');
        navigate("/login")
      } else {
        // Handle registration error
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      // Handle any other error occurred during registration
      alert(error.message);
    }
  };

  return (
    <Container>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px'}}>
        <Card style={{ width: '100%', maxWidth: '500px' }}>
          <CardContent>
            <h4>Register</h4>
            <form onSubmit={formik.handleSubmit}>
              <TextField
                id="fullName"
                label="Full Name"
                fullWidth
                margin="normal"
                name="fullName"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                helperText={formik.touched.fullName && formik.errors.fullName}
              />
              <TextField
                id="email"
                label="Email"
                fullWidth
                margin="normal"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <TextField
                id="image"
                label="Image"
                fullWidth
                margin="normal"
                name="image"
                value={formik.values.image}
                onChange={formik.handleChange}
                error={formik.touched.image && Boolean(formik.errors.image)}
                helperText={formik.touched.image && formik.errors.image}
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
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px' }}>
                <Button variant="contained" color="primary" type="submit">
                  Register
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
