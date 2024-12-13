# Notas de la practica 4.1

## Cambios realizados
- Migración del modelo de datos de coches a concesionarios con la nueva estructura:
  - Cada concesionario incluye nombre, dirección y un listado de coches.
  - Cada coche tiene los atributos modelo, cv (potencia) y precio.
- Creación de los siguientes endpoints para la API:
  - **GET /concesionarios**: Obtener todos los concesionarios.
  - **POST /concesionarios**: Crear un nuevo concesionario.
  - **GET /concesionarios/:id**: Obtener un concesionario por su ID.
  - **PUT /concesionarios/:id**: Actualizar un concesionario.
  - **DELETE /concesionarios/:id**: Eliminar un concesionario.
  - **GET /concesionarios/:id/coches**: Obtener todos los coches de un concesionario.
  - **POST /concesionarios/:id/coches**: Añadir un coche a un concesionario.
  - **GET /concesionarios/:id/coches/:cocheId**: Obtener un coche específico de un concesionario.
  - **PUT /concesionarios/:id/coches/:cocheId**: Actualizar un coche específico.
  - **DELETE /concesionarios/:id/coches/:cocheId**: Eliminar un coche específico.

## Integraciones adicionales
- Configuración de ESLint para garantizar un código limpio y consistente.
- Uso de Prettier para el formato del código.

## Practica
**4.1**
