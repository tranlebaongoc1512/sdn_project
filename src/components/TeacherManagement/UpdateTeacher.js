import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, CardContent, TextField, Button, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Navigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function UpdateTeacher() {
  const { token, userRole } = useContext(AuthContext);
  const baseURL = 'http://localhost:8000/api/teacher/management';
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { id } = useParams();
  const [teacherData, setTeacherData] = useState(null);
  const [isTeacherDataFetched, setIsTeacherDataFetched] = useState(false);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/teacher/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTeacherData(data);
          setIsTeacherDataFetched(true);
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.message}`);
        }
      } catch (error) {
        console.error(error);
        alert('An error occurred while fetching teacher data.');
      }
    };
    fetchTeacherData();
  }, [id, token]);

  useEffect(() => {
    if (!teacherData) return;
    // Check if the user is not an admin or if the teacher data is not found
    if (userRole !== 'admin') {
      alert('You are not authorized to access this page.');
      setIsSubmitted(true);
    }
  }, [teacherData, userRole]);

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      image: '',
    },
    onSubmit: async (values) => {
      try {
        const response = await fetch(`${baseURL}/${id}`, {
          method: 'PUT',
          body: JSON.stringify(values),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          alert('Teacher updated successfully');
          setIsSubmitted(true);
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.message}`);
        }
      } catch (error) {
        console.error(error);
        alert('An error occurred while updating the teacher.');
      }
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required('Required.'),
      email: Yup.string().email('Invalid email format.').required('Required.'),
      image: Yup.string()
        .required('Required.')
        .matches(
          /^assets\/img\/.*$/, // Regex pattern to match "assets/img/..." format
          'Invalid URL format. The URL should start with "assets/img/".'
        ),
        }),
  });

  useEffect(() => {
    if (isTeacherDataFetched) {
      formik.setValues({
        fullName: teacherData.fullName,
        email: teacherData.email,
        image: teacherData.image,
      });
    }
  }, [isTeacherDataFetched, teacherData, formik]);

  if (!isTeacherDataFetched) {
    // Render a loading state while waiting for the teacher data to be fetched.
    return <div>Loading...</div>;
  }

  if (isSubmitted) {
    return <Navigate to="/teachermanagement" />;
  }

  return (
    <Container>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px' }}>
        <Card style={{ width: '100%', maxWidth: '500px' }}>
          <CardContent>
            <h4>Update Teacher</h4>
            <TextField
              id="fullName"
              label="Full Name"
              fullWidth
              margin="normal"
              name="fullName"
              value={formik.values.fullName}
              onChange={formik.handleChange}
            />
            {formik.errors.fullName && (
              <Typography variant="caption" color="red">
                {formik.errors.fullName}
              </Typography>
            )}
            <TextField
              id="email"
              label="Email"
              fullWidth
              margin="normal"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
            {formik.errors.email && (
              <Typography variant="caption" color="red">
                {formik.errors.email}
              </Typography>
            )}
            <TextField
              id="image"
              label="Image URL"
              fullWidth
              margin="normal"
              name="image"
              value={formik.values.image}
              onChange={formik.handleChange}
            />
            {formik.errors.image && (
              <Typography variant="caption" color="red">
                {formik.errors.image}
              </Typography>
            )}
          </CardContent>
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px' }}>
            <Button variant="contained" color="primary" onClick={formik.handleSubmit}>
              Update
            </Button>
          </div>
        </Card>
      </div>
    </Container>
  );
}
