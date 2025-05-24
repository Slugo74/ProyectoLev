# ProyectoLev
Es un repositorio creado para el challenge sotamit 2025.

Es una aplicacion CRUD para la alta/baja/modificacion/eliminacion de empleados, usando:
Backend en Node.js + Express
Base de datos PostgreSQL (Elegi Prisma como ORM)
Docker 
Swagger para documentar

Requisitos: 
    -Docker ([Instalación](https://docs.docker.com/get-docker/)) 
    -Node.js v18+ ([Descarga](https://nodejs.org/))  
    -npm

Para clonar: git clone https://github.com/Slugo74/ProyectoLev.git

Comandos:
En la carpeta raiz del proyecto ejecutar: docker-compose up -d y
En la carpeta backend: 
    - Ejecutar "npm install" para instalar todas las dependencias necesarias
    - Crear un archivo .env y escribir ahi [DATABASE_URL="postgresql://user:password@db:5432/employees_db?schema=public"] (reemplazar user/password con lo escrito en docker-compose.yml)
    - Se puede usar "npx prisma generate" para corroborar que se creo correctamente
    - Ejecutar "npm start" para levantar el servidor backend (de base usa el puerto 3000)

Con el servidor Backend levantado:
    ir a http://localhost:3000 para ver si se levanto correctamente.
    ir a http://localhost:3000/api-docs para entrar a testear la api

En la carpeta frontend:
    - Ejecutar "npm install" para instalar todas las dependencias necesarias
    - Crear un archivo ".env" y escribir la siguiente linea: "PORT=3001" (cualquiera que no sea el puerto 3000 sirve)
    - Ejecutar "npm start" para levantar el servidor frontend(usara el puerto que escribiste en el .env)

Con el servidor frontend levantado:
    ir a http://localhost:3001/employees para ver el listado de empleados
    ir a http://localhost:3001/areas para ver el listado de areas

Otra opcion para levantar los dos servidores de forma rapida:
    - En la carpeta raiz ejecutar "npm install"
    - Para instalar todas las dependencias del back y el front: "npm run install-all"
    - Para levantar el back y el front: "npm run start-all"