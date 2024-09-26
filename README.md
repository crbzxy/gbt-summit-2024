
# GBT Summit 2024

Este proyecto es una aplicación web desarrollada con Next.js para gestionar el registro de usuarios en el evento GBT Summit 2024. La aplicación permite a los usuarios registrarse para asistir al evento de manera presencial o remota, y ofrece una interfaz de administración para los usuarios con rol de administrador.

## Tabla de Contenidos

1. [Instalación](#instalación)
2. [Variables de Entorno](#variables-de-entorno)
3. [Comandos Disponibles](#comandos-disponibles)
4. [Rutas del Frontend](#rutas-del-frontend)
5. [Endpoints del Backend (API)](#endpoints-del-backend-api)
6. [Detalles Adicionales](#detalles-adicionales)

## Instalación

Sigue estos pasos para instalar y ejecutar el proyecto en tu máquina local:

1. Clona este repositorio:

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   ```

2. Navega al directorio del proyecto:

   ```bash
   cd gbt-summit-2024
   ```

3. Instala las dependencias:

   ```bash
   npm install
   ```

4. Configura las variables de entorno siguiendo las instrucciones en la sección [Variables de Entorno](#variables-de-entorno).

5. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

## Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto y configura las siguientes variables:

```plaintext
MONGODB_URI=<tu_mongodb_connection_string>
JWT_SECRET=<tu_clave_secreta_jwt>
```

## Comandos Disponibles

- `npm run dev`: Inicia el servidor de desarrollo.
- `npm run build`: Construye la aplicación para producción.
- `npm start`: Inicia el servidor en modo producción.
- `npm run lint`: Ejecuta el linter para el código del proyecto.

## Rutas del Frontend

Aquí están las rutas principales del frontend:

- `/`: Página principal con contador para el evento.
- `/login`: Página de inicio de sesión para los usuarios.
- `/register`: Página de registro estándar con opción de tipo.
- `/presencial/register`: Página de registro para asistentes presenciales.
- `/remoto/register`: Página de registro para asistentes remotos.
- `/admin`: Panel de administración (solo accesible para administradores).
- `/live`: Página de usuario estándar para usuarios autenticados.

## Endpoints del Backend (API)

Los siguientes endpoints están disponibles en la API:

- **POST** `/api/auth/register`: Registro de un nuevo usuario.
  - Parámetros esperados:
    ```json
    {
      "name": "Nombre del Usuario",
      "email": "correo@ejemplo.com",
      "password": "contraseña123",
      "phone": "5545694354",
      "company": "Empresa XYZ",
      "position": "Puesto",
      "registrationType": "home" // Puede ser 'home', 'presencial', o 'remoto'
    }
    ```

- **POST** `/api/auth/login`: Inicio de sesión de usuario.
  - Parámetros esperados:
    ```json
    {
      "email": "correo@ejemplo.com",
      "password": "contraseña123"
    }
    ```

- **PUT** `/api/auth/update`: Actualización de datos de usuario.
  - Parámetros esperados:
    ```json
    {
      "token": "JWT token",
      "name": "Nuevo Nombre",
      "phone": "9876543210",
      "company": "Nueva Empresa",
      "position": "Nuevo Puesto"
    }
    ```

## Detalles Adicionales

- El proyecto utiliza **Mongoose** para la gestión de la base de datos MongoDB.
- La autenticación se maneja mediante **JSON Web Tokens (JWT)**.
- El frontend está diseñado con **React** y utiliza **Tailwind CSS** para estilos.
- La aplicación está configurada para desplegar imágenes desde un dominio específico.

---

¡Gracias por usar GBT Summit 2024! Si tienes alguna pregunta o sugerencia, no dudes en contactar.
