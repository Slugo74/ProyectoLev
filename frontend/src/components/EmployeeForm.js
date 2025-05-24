import React, { useState, useEffect} from "react";
import axios from 'axios';
import { TextField, Button, MenuItem, Typography, InputLabel } from "@mui/material";

function EmployeeForm() {
    const [areas, setAreas] = useState([]);
    const [formData, setFormData] = useState({
        fullName: '',
        dni: '',
        birthDate: '',
        isDeveloper: false,
        description: '',
        areaId: '',
    });

    useEffect(() => {
        fetchAreas();
    })

    const fetchAreas = async () => {
        const response = await axios.get('http://localhost:3000/areas');
        setAreas(response.data);
    };

    const handleSumbit = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:3000/employees', formData);
        window.location.href = '/employees';
    };

    return (
        <div>
            <Typography variant="h4">Nuevo Empleado</Typography>
            <form onSubmit={handleSumbit}>
                <TextField 
                    label="Nombre Completo"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    required
                />
                <TextField
                    label="DNI"
                    value={formData.dni}
                    onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                    required
                />
                <TextField
                    label="Fecha de Nacimiento"
                    type="date"
                    slotProps={InputLabel.shrink = true }
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    required
                />
                <TextField
                    select
                    label="Área"
                    value={formData.areaId}
                    onChange={(e) => setFormData({ ...formData, areaId: e.target.value })}
                    required
                >
                    {areas.map((area) => (
                        <MenuItem key={area.id} value={area.id}>
                            {area.name}
                        </MenuItem>
                    ))}
                </TextField>
                <Button type="submit" variant="contained">Guardar</Button>
            </form>
        </div>
    );
};

export default EmployeeForm;