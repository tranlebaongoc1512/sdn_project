import React, { useState, useContext, useEffect } from 'react';
import { Container, Card, CardContent, TextField, Button, Typography} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function AddMember() {
  const { token, userRole } = useContext(AuthContext); 
  const baseURL = 'http://localhost:8000/api/member/management'; 
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (userRole !== 'admin') {
      alert('You are not authorized to access this page.');
      setIsSubmitted(true);
    }
  }, [userRole]);

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      image: '',
    },
    onSubmit: async (values) => {
      try {
        const response = await fetch(baseURL, {
          method: 'POST',
          body: JSON.stringify(values),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          alert('member added successfully');
          setIsSubmitted(true);
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.message}`);
        }
      } catch (error) {
        console.error(error);
        alert('An error occurred while adding the member.');
      }
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required('Required.'),
      email: Yup.string().email('Invalid email format.').required('Required.'),
      password: Yup.string().required('Required.').min(6, 'Password must be at least 6 characters.'),
      image: Yup.string().required('Required.').url('Invalid URL format'),
    }),
  });

  if (isSubmitted) {
    return <Navigate to="/membermanagement" />;
  }

  return (
    <Container>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px' }}>
        <Card style={{ width: '100%', maxWidth: '500px' }}>
          <CardContent>
            <h4>Add member</h4>
            <TextField
              id="fullName"
              label="Full Name"
              fullWidth
              margin="normal"
              name="fullName"
              value={formik.values.fullName}
              onChange={formik.handleChange}
            />
            {formik.errors.fullName && <Typography variant="caption" color="red">{formik.errors.fullName}</Typography>}
            <TextField
              id="email"
              label="Email"
              fullWidth
              margin="normal"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
            {formik.errors.email && <Typography variant="caption" color="red">{formik.errors.email}</Typography>}
            <TextField
              id="password"
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
            />
            {formik.errors.password && <Typography variant="caption" color="red">{formik.errors.password}</Typography>}
            <TextField
              id="image"
              label="Image URL"
              fullWidth
              margin="normal"
              name="image"
              value={formik.values.image}
              onChange={formik.handleChange}
            />
            {formik.errors.image && <Typography variant="caption" color="red">{formik.errors.image}</Typography>}
          </CardContent>
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px' }}>
            <Button variant="contained" color="primary" onClick={formik.handleSubmit}>
              Add
            </Button>
          </div>
        </Card>
      </div>
    </Container>
  );
}
