import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, CardContent, TextField, Button} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Navigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const baseURL = 'http://localhost:8000/api/member/management';

export default function UpdateMember() {
  const { token, userRole } = useContext(AuthContext);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { id } = useParams();
  const [memberData, setMemberData] = useState(null);
  const [isFetchMemberData, setIsFetchMemberData] = useState(false);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/member/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setMemberData(data);
          setIsFetchMemberData(true);
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.message}`);
        }
      } catch (error) {
        console.error(error);
        alert('An error occurred while fetching member data.');
        setIsSubmitted(true);
      }
    };
    fetchMemberData();
  }, [id, token]);

  useEffect(() => {
    if (isFetchMemberData) {
      formik.setValues({
        fullName: memberData.fullName,
        email: memberData.email,
        image: memberData.image,
      });
    }
  }, [isFetchMemberData, memberData]);

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
          alert('Member updated successfully');
          setIsSubmitted(true);
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.message}`);
        }
      } catch (error) {
        console.error(error);
        alert('An error occurred while updating the member.');
      }
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required('Required.'),
      email: Yup.string().email('Invalid email format.').required('Required.'),
      image: Yup.string()
        .required('Required.')
        .matches(
          /^\/assets\/img\/.*$/, // Regex pattern to match "/assets/img/..." format
          'Invalid URL format. The URL should start with "/assets/img/".'
        ),
    }),
  });

  if (!isFetchMemberData) {
    // Render a loading state while waiting for the memberData to be fetched.
    return <div>Loading...</div>;
  }

  if (isSubmitted) {
    return <Navigate to="/membermanagement" />;
  }

  return (
    <Container>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px' }}>
        <Card style={{ width: '100%', maxWidth: '500px' }}>
          <CardContent>
            <h4>Update Member</h4>
            <TextField
              id="fullName"
              label="Full Name"
              fullWidth
              margin="normal"
              name="fullName"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              error={formik.touched.fullName && formik.errors.fullName}
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
              error={formik.touched.email && formik.errors.email}
              helperText={formik.touched.email && formik.errors.email}
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
          </CardContent>
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px' }}>
            <Button onClick={() => setIsSubmitted(true)}>Cancel</Button>
            <Button onClick={formik.handleSubmit} color="primary">
              Update
            </Button>
          </div>
        </Card>
      </div>
    </Container>
  );
}
