# Documentación de la Base de Datos - MiProyecto

Este documento describe la estructura, funcionalidades y lógica de la base de datos utilizada en el proyecto.

## 📊 Resumen General
La base de datos **MiProyecto** está diseñada para gestionar una aplicación de control de inventario/despensa personal. Su objetivo principal es permitir a los usuarios registrar productos, controlar sus existencias y, lo más importante, supervisar las **fechas de caducidad** para evitar el desperdicio de alimentos.

---

## 🚀 Funcionalidades Principales

1.  **Autenticación y Autorización**: Sistema basado en roles (Admin/User) para asegurar el acceso a los datos.
2.  **Catálogo y Despensa Personal**: Los productos creados pertenecen a un usuario específico, con su cantidad y caducidad.
3.  **Integridad de Datos**: Restricciones (Constraints) para evitar duplicados lógicos y asegurar que cada registro pertenezca a un usuario válido.

---

## 🗂️ Diccionario de Tablas

### 1. `Roles`
Define los niveles de acceso.
- `id`: Identificador único.
- `name`: Nombre del rol (ej: `ROLE_ADMIN`, `ROLE_USER`).

### 2. `Users`
Almacena la información de las cuentas de usuario.
- `username`: Identificador para el inicio de sesión (Único).
- `password`: Hash de la contraseña.
- `enabled`: Estado de la cuenta (activa/inactiva).

### 3. `Users_Roles`
Tabla de unión (Many-to-Many) entre usuarios y roles.
- Permite que un usuario tenga múltiples permisos.
- Configurada con `ON DELETE CASCADE` para mantener la integridad.

### 4. `Products`
El inventario de productos en la despensa.
- `barcode`: Código de barras (Único).
- `name`: Nombre descriptivo (ej: "Leche entera").
- `cantidad`: Cantidad disponible.
- `user_id`: Referencia al usuario dueño del producto.

---

## 🛠️ Instrucciones de Uso

### Instalación
El script SQL se encuentra en `src/main/resources/bd_proyecto.sql`. Para inicializar la base de datos:
1. Ejecutar el script en un servidor MySQL compatible.
2. El script borrará la base de datos si ya existe (`DROP DATABASE IF EXISTS`) y la creará de nuevo.

### Datos de Prueba
El sistema incluye un usuario administrador por defecto:
- **Usuario**: `admin`
- **Contraseña**: `admin` (hash: `$2a$12$Naxgyyspnvy4njAjyrTnjOTOTzhYGnsSlppiWljc.faTkM5qK1Uly`)

---

## 📝 Notas de Diseño
- Se utiliza `BIGINT` para las claves primarias para asegurar escalabilidad.
- Los campos de texto tienen límites de caracteres optimizados (`VARCHAR`).
- Se recomienda el uso de **Spring Security** en el backend para manejar la lógica de los roles definidos en estas tablas.
