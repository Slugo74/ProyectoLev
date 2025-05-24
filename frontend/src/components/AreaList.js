import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function AreaList() {
    const [areas, setAreas] = useState([]);

    useEffect(() => {
        fetchAreas();
    }, []);

    const fetchAreas = async () => {
        const response = await axios.get('http://localhost:3000/areas');
        setAreas(response.data);
    };

    const deleteArea = async (id) => {
        await axios.delete(`http://localhost:3000/areas/${id}`);
        fetchAreas();
    };

    return(
        <div>
            <Typography variant="h4">Areas</Typography>
            <Link to="/create-area">
                <Button variant="contained" color="primary">Nuevo Area</Button>
            </Link>
            <Table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {areas.map((area) => (
                        <tr key={area.id}>
                            <td>{area.name}</td>
                            <td>
                                <Button onClick={() => deleteArea(area.id)} color="error">Eliminar</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

export default AreaList;