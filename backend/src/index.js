const express = require('express');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();
const PORT = 3000;

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de empleados',
            version: '1.0.0',
        },
        components: {
            schemas: {
                Employee: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        fullName: { type: 'string', example: 'Juan Pérez' },
                        dni: { type: 'string', example: '12345678' },
                        birthDate: { type: 'string', format: 'date', example: '1990-01-01' },
                        isDeveloper: { type: 'boolean', example: true },
                        description: { type: 'string', example: 'Desarrollador FullStack' },
                        areaId: { type: 'integer', example: 1 },
                    },
                },
                Area: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        name: { type: 'string', example: 'TI' },
                    },
                },
            },
        },
    },
    apis: ['./src/index.js'],
};

const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

app.use(express.json());

//Basico, de prueba
app.get('/', (req, res) => {
    res.send("API funcionando");
});


// 1. GET (Para listar todos los empleados)
/** 
 * @swagger
 * /employees:
 *  get:
 *      summary: Obtiene todos los empleados
 *      responses: 
 *          200:
 *              description: Lista de empleados
 *              content: 
 *                  aplication/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Employee'
 */
app.get('/employees', async(req, res) => {
    try {
        const employees = await prisma.employee.findMany({
            include: { area: true },
        });
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener empleados' });
    }
});

// 2. GET (Para listar un empleado en particular)
app.get('/employees/:id', async(req, res) => {
    const { id } = req.params;
    try {
        const employee = await prisma.employee.findUnique({
            where: { id: parseInt(id) },
            include: { area: true },
        });
        if (!employee) {
            return res.status(404).json({ error: 'Error. Empleado no encontrado' });
        }
        res.json(employee);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar empleado' });
    }
});

// 3.POST (Para crear un nuevo empleado)
/**
 * @swagger
 * /employees:
 * post:
 *  summary: Crea un nuevo empleado
 *  requestBody:
 *      required: true
 *      content: 
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schema/Employee'
 *              example:
 *                  fullName: "Santiago Lugo"
 *                  dni: 50668243
 *                  birthDate: "2001-09-11"
 *                  isDeveloper: false
 *                  description: "Lo estamos probando"
 *                  areaId: 2
 *  responses:
 *      201:
 *          description: Empleado creado!
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schema/Employee'
 *      400:
 *          description: Error por datos invalidos
 */
app.post('/employees', async(req, res) => {
    const { fullName, dni, birthDate, isDeveloper, description, areaId } = req.body;
    try {
        const newEmployee = await prisma.employee.create({
            data: {
                fullName,
                dni,
                birthDate: new Date(birthDate),
                isDeveloper,
                description,
                area: parseInt(areaId),
            },
        });
        res.status(201).json(newEmployee);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear empleado', details: error.message });
    }
});

// 4.PUT (Para actualizar un empleado)
app.put('/employees/:id', async(req, res) => {
    const { id } = req.params;
    const { fullName, dni, birthDate, isDeveloper, description, areaId } = req.body;
    try {
        const updatedEmployee = await prisma.employee.update({
            where: { id: parseInt(id) },
            data: {
                fullName,
                dni,
                birthDate: new Date(birthDate),
                isDeveloper,
                description,
                areaId: parseInt(areaId),
            },
        });
        res.json(updatedEmployee);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar empleado', details: error.message })
    }
});

app.delete('/employees/:id', async(req, res) => {
    const { id } = req.params;
    try {
        await prisma.employee.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Error al eliminar empleado' })
    }
});

//Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});