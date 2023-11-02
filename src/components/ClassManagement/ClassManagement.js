import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import EditIcon from '@mui/icons-material/Edit';
import {Avatar, Button} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarExport,
} from '@mui/x-data-grid';


export default function ClassManagement() {
  const { token } = useContext(AuthContext);
  const [classes, setClassData] = useState([])
  
  useEffect(() => {
    const fetchTeacherData = async () => {
        try {
          const response = await fetch('http://localhost:8000/api/class', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setClassData(data);
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
        { field: 'id', headerName: 'ID', width: 40, renderCell: (params) =>  params.row.id},
        {
            field: 'image',
            headerName: 'Image',
            width: 100,
            renderCell: (params) =>  (
                <div>
                    <Avatar alt={params.row.id} src={params.row.image} />
                </div>
                )
          },
        {
          field: 'name',
          headerName: 'Name',
          width: 200,
          renderCell: (params) =>  params.row.name
        },
        {
          field: 'type',
          headerName: 'Type',
          width: 100,
          renderCell: (params) => params.row.type
        },
        {
          field: 'classSize',
          headerName: 'Class Size',
          width: 110,
          renderCell: (params) => params.row.classSize
        },
        {
            field: 'slotLeft',
            headerName: 'Slot left',
            width: 110,
            renderCell: (params) => params.row.slotLeft
        },
        {
            field: 'time',
            headerName: 'Time',
            width: 140,
            renderCell: (params) => params.row.time
        },
        {
            field: 'date',
            headerName: 'Date',
            width: 140,
            renderCell: (params) => params.row.date
        },
        {
            field: 'teacherId',
            headerName: 'Teacher ID',
            width: 100,
            renderCell: (params) => params.row.teacherId
        },
        {
          field: 'actions',
          headerName: 'Actions',
          width: 100,
          renderCell: (params) => (
            <div>
                <GridActionsCellItem
                icon={<EditIcon />}
                label="Edit"
                component={Link}
                to={`/mangagement/class/update/${params.row.id}`}
                />
            </div>
          ),
        },
      ];

  const rows = classes

  return (
    <div style={{ width: '95%', margin: '0px auto 20px auto', borderRadius:'20px'}}>
      <Button variant="outlined" component={Link} to="/mangagement/class/add" sx={{margin: '10px 0 5px 0', backgroundColor:'white' ,borderColor: '#6DABB4', color: 'black'}}>+ Add class</Button>
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        components={{
          Toolbar: GridToolbarContainer,
          ToolbarExport: GridToolbarExport,
        }}
        sx={{backgroundColor: 'white'}}
      />
    </div>
  );
}