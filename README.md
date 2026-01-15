# Expenses

API REST con arquitectura hexagonal para la gestión de gastos desarrollada con NestJS, TypeORM y PostgreSQL. Permite crear, consultar, actualizar y eliminar gastos con soporte para paginación y filtrado por categoría, caracteristicas adicionales (Logging, Docker, Swagger).

## Desarrollo con Docker

### Requisitos
- Docker
- Configurar variables de entorno

### Pasos para levantar el proyecto

1. **Clonar el repositorio e instalar dependencias:**
   ```bash
   yarn install
   ```

2. **Configurar variables de entorno:**
   renombrar el archivo `.env.template` a `.env` en la raíz del proyecto y asignar variables por ejemplo:
   ```
   DB_NAME=expenses_db
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_PORT=5432
   PORT=3000
   NODE_ENV=development
   ```

  **Nota** para produccion se debe de establecer la variable ALLOWED_ORIGINS

3. **Levantar la base de datos con Docker:**
   ```bash
   docker-compose up -d
   ```

**Se crearan las imagenes de la base de datos de postgres y la API corriendo en el puerto indicado "3000" por defecto**

La API estará disponible en `http://localhost:3000/api/v1` - Documentacion de Swagger en `http://localhost:3000/api`

## Endpoints disponibles

### Health Check

**GET** `/api/v1/health`

Verifica el estado de la API y la conexión a la base de datos.

**Respuesta exitosa:** `200 OK`
```json
{
  "status": "ok",
  "info": { "database": { "status": "up" } }
}
```

---

### Seed y Limpieza de Datos

#### Poblar base de datos con datos de prueba

**POST** `/api/v1/seed`

**⚠️ Importante:** Este endpoint solo funciona en modo desarrollo (`NODE_ENV !== 'production'`). Inserta datos de prueba en la base de datos si la tabla está vacía.

**Respuesta exitosa:** `200 OK`
```json
{
  "message": "Seed completed successfully",
  "totalInserted": 25
}
```

**Errores posibles:**
- `403 Forbidden`: Operación deshabilitada en producción
- `200 OK` con mensaje: "Seed already executed" - La tabla ya contiene datos

**Uso recomendado:** Ejecuta este endpoint después de levantar la aplicación por primera vez para tener datos de prueba disponibles inmediatamente.

---

#### Limpiar todos los gastos

**POST** `/api/v1/seed/clear`

**⚠️ Importante:** Este endpoint solo funciona en modo desarrollo (`NODE_ENV !== 'production'`). Elimina todos los gastos de la base de datos y reinicia los IDs.

**Respuesta exitosa:** `200 OK`
```json
{
  "message": "Expenses table cleared"
}
```

**Errores posibles:**
- `403 Forbidden`: Operación deshabilitada en producción

**Uso recomendado:** Utiliza este endpoint para limpiar la base de datos antes de ejecutar el seed nuevamente o para resetear el estado de desarrollo.

---

### Gastos (Expenses)

#### Crear gasto

**POST** `/api/v1/expenses`

Crea un nuevo gasto.

**Body (JSON):**
- `description` (string, requerido, mínimo 5 caracteres): Descripción del gasto
- `amount` (string, requerido): Monto del gasto (debe ser mayor a 0, máximo 2 decimales)
- `category` (string, opcional, máximo 50 caracteres): Categoría del gasto

**Ejemplo:**
```json
{
  "description": "Compra de supermercado",
  "amount": "150.50",
  "category": "comida"
}
```

**Respuesta exitosa:** `201 Created`
```json
{
  "id": 1,
  "description": "Compra de supermercado",
  "amount": "150.50",
  "category": "comida",
  "date": "2024-01-15T10:30:00.000Z"
}
```

**Errores posibles:**
- `400 Bad Request`: Validación fallida (campos requeridos faltantes, formato incorrecto, monto inválido)
- `500 Internal Server Error`: Error interno del servidor

---

#### Listar gastos

**GET** `/api/v1/expenses`

Obtiene una lista paginada de gastos, ordenados por fecha descendente.

**Query Parameters:**
- `page` (number, opcional, default: 1, mínimo: 1): Número de página
- `limit` (number, opcional, default: 10, mínimo: 1, máximo: 100): Cantidad de resultados por página
- `category` (string, opcional, máximo 50 caracteres): Filtrar por categoría

**Ejemplo:**
```
GET /api/v1/expenses?page=1&limit=10&category=comida
```

**Respuesta exitosa:** `200 OK`
```json
{
  "data": [
    {
      "id": 1,
      "description": "Compra de supermercado",
      "amount": "150.50",
      "category": "comida",
      "date": "2024-01-15T10:30:00.000Z"
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "lastPage": 3
  }
}
```

**Errores posibles:**
- `400 Bad Request`: Parámetros de consulta inválidos
- `500 Internal Server Error`: Error interno del servidor

---

#### Obtener gasto por ID

**GET** `/api/v1/expenses/:id`

Obtiene un gasto específico por su ID.

**Parámetros de ruta:**
- `id` (number): ID del gasto

**Respuesta exitosa:** `200 OK`
```json
{
  "id": 1,
  "description": "Compra de supermercado",
  "amount": "150.50",
  "category": "comida",
  "date": "2024-01-15T10:30:00.000Z"
}
```

**Errores posibles:**
- `404 Not Found`: Gastos no encontrado
- `500 Internal Server Error`: Error interno del servidor

---

#### Actualizar gasto

**PATCH** `/api/v1/expenses/:id`

Actualiza parcialmente un gasto existente.

**Parámetros de ruta:**
- `id` (number): ID del gasto

**Body (JSON):** Todos los campos son opcionales
- `description` (string, mínimo 5 caracteres): Descripción del gasto
- `amount` (string): Monto del gasto (debe ser mayor a 0, máximo 2 decimales)
- `category` (string, máximo 50 caracteres): Categoría del gasto

**Ejemplo:**
```json
{
  "amount": "175.00"
}
```

**Respuesta exitosa:** `200 OK`
```json
{
  "id": 1,
  "description": "Compra de supermercado",
  "amount": "175.00",
  "category": "comida",
  "date": "2024-01-15T10:30:00.000Z"
}
```

**Errores posibles:**
- `400 Bad Request`: Validación fallida
- `404 Not Found`: Gastos no encontrado
- `500 Internal Server Error`: Error interno del servidor

---

#### Eliminar gasto

**DELETE** `/api/v1/expenses/:id`

Elimina un gasto por su ID.

**Parámetros de ruta:**
- `id` (number): ID del gasto

**Respuesta exitosa:** `204 No Content` (sin cuerpo de respuesta)

**Errores posibles:**
- `404 Not Found`: Gastos no encontrado
- `500 Internal Server Error`: Error interno del servidor

---

## Notas adicionales

- Todos los endpoints requieren que el body sea válido JSON
- La validación de datos se realiza automáticamente usando `class-validator`
- Los campos no permitidos en el body serán rechazados automáticamente
- El prefijo base de la API es `/api/v1`
- El puerto por defecto es `3000` (configurable mediante variable de entorno `PORT`)
- Para correr en modo desarrollo ya sea con docker o directamente la API se deben de comentar los siguientes atributos en el app.module.ts
```
// ssl: true,
// extra: {
//   ssl: {
//     rejectUnauthorized: false,
//   },
// },
```

