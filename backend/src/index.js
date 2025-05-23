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
                        name: { type: 'string', example: 'Marketing' },
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

/* ---------- Endpoints para tabla de Employees ---------------- */

// 1. GET (Para listar todos los empleados)
/** 
 * @swagger
 * /employees:
 *   get:
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
/**
 *@swagger
 * /employees/{id}:
 *   get:
 *     summary: Obtiene un empleado por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del empleado
 *     responses:
 *       200:
 *         description: Detalles del empleado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       404:
 *         description: Empleado no encontrado
 */
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
 *   post:
 *     summary: Crea un nuevo empleado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Employee'
 *           example:
 *             fullName: "Ana García"
 *             dni: "87654321"
 *             birthDate: "1985-05-15"
 *             isDeveloper: false
 *             description: "Diseñadora UX"
 *             areaId: 2
 *     responses:
 *       201:
 *         description: Empleado creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       400:
 *         description: Error por datos inválidos o faltantes
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
                areaId: parseInt(areaId),
            },
        });
        res.status(201).json(newEmployee);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear empleado', details: error.message });
    }
});

// 4.PUT (Para actualizar un empleado)
/**
 * @swagger
 * /employees/{id}:
 *   put:
 *     summary: actualiza un empleado
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Id del empleado
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Employee'
 *           example:
 *             fullname: "Santiago Lugo"
 *             dni: "44668549"
 *             birthDate: "2001-09-11"
 *             isDeveloper: false
 *             description: "Lo estamos probando"
 *             areaId: 2
 *     responses:
 *       200:
 *         description: Empleado actualizado
 *       404:
 *         description: Empleado no encontrado
 */
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
        res.status(400).json({ error: 'Error al actualizar empleado', details: error.message });
    }
});

//4.DELETE Eliminar un empleado
/** 
 * @swagger
 * /employees/{id}:
 *   delete:
 *     summary: Elimina un empleado
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: 
 *           type: integer
 *         description: Id del empleado
 *   responses:
 *     204:
 *       description: Empleado eliminado
 *     404:
 *       description: Empleado no encontrado
 */
app.delete('/employees/:id', async(req, res) => {
    const { id } = req.params;
    try {
        await prisma.employee.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Error al eliminar empleado' });
    }
});

/* ---------- Endpoints para tabla de Areas ---------------- */
//1. GET de areas
/**
 * @swagger
 * /areas:
 *   get:
 *     summary: Trae todas las areas
 *     responses:
 *       200:
 *         description: Lista de areas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Area'
 */
app.get('/areas', async(req, res) => {
    try {
        const area = await prisma.area.findMany({});
        res.json(area);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener areas' });
    }
});

//2. GET de area(para un area e particular)
/**
 * @swagger
 * /areas/{id}:
 *   get:
 *     summary: Obtiene un área por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del área
 *     responses:
 *       200:
 *         description: Detalles del área
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Area'
 *       404:
 *         description: Área no encontrada
 */
app.get('/areas/:id', async(req, res) => {
    const { id } = req.params;
    try {
        const area = await prisma.area.findUnique({
            where: { id: parseInt(id) },
        });
        if (!area) {
            return res.status(404).json({ error: 'Area no encontrada' });
        }
        res.json(area);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar area' });
    }
});

//3. POST de area(crear una nueva area)
/**
 * @swagger
 * /areas:
 *  post:
 *   summary: Crea una nueva area
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/Area'
 *         example:
 *           name: "Marketing"
 *   responses:
 *     201:
 *       description: Area creada
 *     400:
 *       description: Error en los datos 
 */
app.post('/areas', async(req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'El nombre del areas es obligatorio' });
    }
    try {
        const newArea = await prisma.area.create({
            data: { name },
        });
        res.status(201).json(newArea);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear area', details: error.message });
    }
});

//4. PUT de area(actualiza el area)
/**
 * @swagger
 * /areas/{id}:
 *   put:
 *     summary: Actualiza un área
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Area'
 *           example:
 *             name: "Marketing Digital"
 *     responses:
 *       200:
 *         description: Área actualizada
 *       404:
 *         description: Área no encontrada
 */
app.put('/areas/:id', async(req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const updatedArea = await prisma.area.update({
            where: { id: parseInt(id) },
            data: {
                name: name,
            },
        });
        res.json(updatedArea);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar area', details: error.message });
    }
});

//4.DELETE Elimina un Area
/**
 * @swagger
 * /areas/{id}:
 *   delete:
 *     summary: Elimina un área
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Área eliminada
 *       404:
 *         description: Área no encontrada
 */
app.delete('/areas/:id', async(req, res) => {
    const { id } = req.params;
    try {
        await prisma.area.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Error al eliminar área' });
    }
});

//Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});