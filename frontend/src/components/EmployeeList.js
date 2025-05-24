import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { Table, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function EmployeeList() {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        const response = await axios.get('http://localhost:3000/employees');
        setEmployees(response.data);
    };

    const deleteEmployee = async (id) => {
        await axios.delete(`http://localhost:3000/employees/${id}`);
        fetchEmployees();
    };

    return(
    <div>
      <Typography variant="h4">Lista de Empleados</Typography>
      <Link to="/create-employee">
        <Button variant="contained" color="primary">Nuevo Empleado</Button>
      </Link>
      <Table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>DNI</th>
            <th>Área</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.fullName}</td>
              <td>{emp.dni}</td>
              <td>{emp.area?.name}</td>
              <td>
                <Button onClick={() => deleteEmployee(emp.id)} color="error">Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
    );
}

export default EmployeeList;