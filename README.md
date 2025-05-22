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
En la carpeta raiz del proyecto ejecutar: docker-compose up -d
En la carpeta backend: 
    - Ejecutar "npm install" para instalar todas las dependencias necesarias
    - Crear un archivo .env y escribir ahi [DATABASE_URL="postgresql://user:password@db:5432/employees_db?schema=public"] (reemplazar user/password con lo est¿crito en docker-compose.yml)
    - Se puede usar "npx prisma generate" para corroborar que se creo correctamente
    - Ejecutar "npm start" para levantar el servidor backend

Con el servidor Backend levantado:
    ir a http://localhost:3000 para ver si se levanto correctamente.
    ir a http://localhost:300/api-docs para entrar a testear la api