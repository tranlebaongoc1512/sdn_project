import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import EditIcon from '@mui/icons-material/Edit';
import { Avatar, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarExport,
} from '@mui/x-data-grid';


export default function TeacherManagement() {
  const { token } = useContext(AuthContext);
  const [teacher, setTeacherData] = useState([])

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/teacher/management', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTeacherData(data);
        } else {
          // Handle error response
          const errorData = await response.json();
          alert(errorData.message);
        }
      } catch (error) {
        alert(error.message);
      }
    };
    fetchTeacherData(token)
  })


  const columns = [
    { field: 'id', headerName: 'ID', width: 100, renderCell: (params) => params.row.id },
    {
      field: 'image',
      headerName: 'image',
      width: 200,
      renderCell: (params) => (
        <div>
          <Avatar alt={params.row.id} src={params.row.image} />
        </div>
      )
    },
    {
      field: 'fullName',
      headerName: 'fullName',
      width: 300,
      renderCell: (params) => params.row.fullName
    },
    {
      field: 'role',
      headerName: 'role',
      width: 200,
      renderCell: (params) => params.row.role
    },
    {
      field: 'email',
      headerName: 'email',
      width: 240,
      renderCell: (params) => params.row.email
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <div>
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            component={Link}
            to={`/mangagement/teacher/update/${params.row.id}`}
          />
        </div>
      ),
    },
  ];

  const rows = teacher

  return (
    <div style={{ width: '95%', margin: '0px auto 20px auto', borderRadius: '20px' }}>
      <Button variant="outlined" component={Link} to="/mangagement/teacher/add" style={{ margin: '10px 0 5px 0', backgroundColor: 'white', borderColor: '#6DABB4', color: 'black' }}>+ Add Teacher</Button>
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        components={{
          Toolbar: GridToolbarContainer,
          ToolbarExport: GridToolbarExport,
        }}
        sx={{ backgroundColor: 'white' }}
      />
    </div>
  );
}