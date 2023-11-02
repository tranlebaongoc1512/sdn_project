import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, CardContent, TextField, Button, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const baseURL = 'http://localhost:8000/api/class/management';

export default function AddClass() {
  const { token, userRole } = useContext(AuthContext);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [teacherList, setTeacherList] = useState([]);

  useEffect(() => {
    if (userRole !== 'admin') {
      alert('You are not authorized to access this page.');
      setIsSubmitted(true);
    }

    // Fetch teachers and set the teacher list
    const fetchTeachers = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/teacher', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTeacherList(data);
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.message}`);
        }
      } catch (error) {
        console.error(error);
        alert('An error occurred while fetching teacher data.');
      }
    };

    fetchTeachers();
  }, [userRole, token]);

  // Formik configuration
  const formik = useFormik({
    initialValues: {
      name: '',
      type: '',
      classSize: '',
      time: '',
      date: '', 
      image: '',
      teacherId: '',
    },
    onSubmit: async (values) => {
      try {
        // Convert date to the required format MM-dd-yyyy
        const formattedDate = new Date(values.date).toLocaleDateString('en-US');

        const response = await fetch(baseURL, {
          method: 'POST',
          body: JSON.stringify({ ...values, date: formattedDate }), // Use the formatted date
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          alert('Class added successfully');
          setIsSubmitted(true);
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.message}`);
        }
      } catch (error) {
        console.error(error);
        alert('An error occurred while adding the class.');
      }
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required.'),
      type: Yup.string().required('Required.'),
      classSize: Yup.number().required('Required.').integer().min(1, 'Must be at least 1'),
      time: Yup.string().required('Required.').matches(/^\d{2}:\d{2}\s?-\s?\d{2}:\d{2}$/, 'Invalid time format (HH:mm - HH:mm)'),
      date: Yup.string()
            .required('Required.')
            .test('valid-date', 'Invalid date format (MM-dd-yyyy)', (value) => {
              if (!value) return true; 
              const dateRegex = /^\d{2}-\d{2}-\d{4}$/; 
              return dateRegex.test(value);
            }),
      image: Yup.string().required('Required.').url('Invalid URL format'),
      teacherId: Yup.string().required('Required.'),
    }),
  });

  if (isSubmitted) {
    return <Navigate to="/classmanagement" />;
  }

  return (
    <Container>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px' }}>
        <Card style={{ width: '100%', maxWidth: '500px' }}>
          <CardContent>
            <h4>Add Class</h4>
            <TextField
              id="name"
              label="Class Name"
              fullWidth
              margin="normal"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && formik.errors.name}
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              id="type"
              label="Type"
              fullWidth
              margin="normal"
              name="type"
              value={formik.values.type}
              onChange={formik.handleChange}
              error={formik.touched.type && formik.errors.type}
              helperText={formik.touched.type && formik.errors.type}
            />
            <TextField
              id="classSize"
              label="Class Size"
              type="number"
              fullWidth
              margin="normal"
              name="classSize"
              value={formik.values.classSize}
              onChange={formik.handleChange}
              error={formik.touched.classSize && formik.errors.classSize}
              helperText={formik.touched.classSize && formik.errors.classSize}
            />
            <TextField
              id="time"
              label="Time"
              fullWidth
              margin="normal"
              name="time"
              value={formik.values.time}
              onChange={formik.handleChange}
              error={formik.touched.time && formik.errors.time}
              helperText={formik.touched.time && formik.errors.time}
            />
            <TextField
              id="date"
              label="date"
              fullWidth
              margin="normal"
              name="date"
              value={formik.values.date}
              onChange={formik.handleChange}
              error={formik.touched.date && formik.errors.date}
              helperText={formik.touched.date && formik.errors.date}
            />
            <TextField
              id="image"
              label="Image URL"
              fullWidth
              margin="normal"
              name="image"
              value={formik.values.image}
              onChange={formik.handleChange}
              error={formik.touched.image && formik.errors.image}
              helperText={formik.touched.image && formik.errors.image}
            />

            {/* Teacher selection dropdown */}
            <TextField
              id="teacherId"
              label="Teacher"
              select
              fullWidth
              margin="normal"
              name="teacherId"
              value={formik.values.teacherId}
              onChange={formik.handleChange}
              error={formik.touched.teacherId && formik.errors.teacherId}
              helperText={formik.touched.teacherId && formik.errors.teacherId}
            >
              {teacherList.map((teacher) => (
                <MenuItem key={teacher.id} value={teacher.id}>
                  {`${teacher.id} - ${teacher.fullName}`}
                </MenuItem>
              ))}
            </TextField>
          </CardContent>
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px' }}>
            <Button onClick={() => setIsSubmitted(true)}>Cancel</Button>
            <Button onClick={formik.handleSubmit} color="primary">
              Add
            </Button>
          </div>
        </Card>
      </div>
    </Container>
  );
}
