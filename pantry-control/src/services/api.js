// ============================================
// CONFIGURACIÓN DE LA API - SPRING BACKEND
// ============================================
// URL base del backend en Spring Boot
// Cambiar según el puerto y host donde corra el backend
const URL_API = 'http://localhost:8080';

// ============================================
// FUNCIÓN INTERCEPTOR - Inyecta token en peticiones
// ============================================
// Esta función se ejecuta en TODAS las peticiones al backend
// Automáticamente agrega el Bearer token al header si existe
const hacerPeticion = async (ruta, opciones = {}) => {
  // Obtener el token guardado en localStorage
  const token = localStorage.getItem('token');
  
  // Preparar los headers de la petición
  const encabezados = {
    'Content-Type': 'application/json',
    // Si hay token, lo añadimos al header Authorization
    ...(token && { Authorization: `Bearer ${token}` }),
    // Si el usuario pasa más headers, los mergeamos
    ...opciones.headers,
  };

  try {
    // Hacer la petición al backend
    const respuesta = await fetch(`${URL_API}${ruta}`, {
      ...opciones,
      headers: encabezados,
    });

    // Si la respuesta NO es exitosa (status >= 400)
    if (!respuesta.ok) {
      // Intentamos obtener el mensaje de error del backend
      const datosError = await respuesta.json().catch(() => ({}));
      throw new Error(datosError.mensaje || `Error en la petición: ${respuesta.status}`);
    }

    // Convertir la respuesta a texto primero
    // (algunas respuestas como DELETE pueden no tener contenido)
    const texto = await respuesta.text();
    // Si hay contenido, parsearlo a JSON
    return texto ? JSON.parse(texto) : null;
  } catch (error) {
    // Log del error para debugging
    console.error(`❌ Error en API (${ruta}):`, error);
    throw error;
  }
};

// ============================================
// SERVICIO DE API - TODOS LOS ENDPOINTS
// ============================================
// Aquí van TODAS las llamadas al backend de Spring
export const serviciosAPI = {
  
  // LOGIN - Enviar usuario y contraseña
  // Endpoint Spring: POST /login
  // Body esperado: { usuario: string, contraseña: string }
  // Respuesta: { token: string, usuario: object }
  iniciarSesion: async (credenciales) => {
    return await hacerPeticion('/login', {
      method: 'POST',
      body: JSON.stringify({
        usuario: credenciales.usuario,
        contraseña: credenciales.contraseña
      })
    });
  },

  // REGISTRO - Crear nueva cuenta
  // Endpoint Spring: POST /api/usuarios/registrar
  // Body esperado: { usuario: string, correo: string, contraseña: string }
  // Respuesta: { id: number, usuario: string, correo: string }
  registrarUsuario: async (datosUsuario) => {
    return await hacerPeticion('/api/usuarios/registrar', {
      method: 'POST',
      body: JSON.stringify({
        usuario: datosUsuario.usuario,
        correo: datosUsuario.correo,
        contraseña: datosUsuario.contraseña
      })
    });
  },

  // ============================================
  // GESTIÓN DE DESPENSA (PRODUCTOS)
  // ============================================

  // OBTENER TODOS LOS PRODUCTOS del usuario autenticado
  // Endpoint Spring: GET /api/productos
  // Headers: Requiere token (se añade automáticamente)
  // Respuesta: [ { id, nombre, marca, caducidad, cantidad }, ... ]
  obtenerDespensa: async () => {
    return await hacerPeticion('/api/productos', {
      method: 'GET'
    });
  },

  // AÑADIR UN NUEVO PRODUCTO
  // Endpoint Spring: POST /api/productos
  // Headers: Requiere token (se añade automáticamente)
  // Body esperado: { nombre: string, marca: string, fechaCaducidad: date, cantidad: number }
  // Respuesta: { id, nombre, marca, caducidad, cantidad }
  anadirProducto: async (datosProducto) => {
    return await hacerPeticion('/api/productos', {
      method: 'POST',
      body: JSON.stringify({
        nombre: datosProducto.nombre,
        marca: datosProducto.marca,
        fechaCaducidad: datosProducto.fechaCaducidad,
        cantidad: datosProducto.cantidad
      })
    });
  },

  // ACTUALIZAR UN PRODUCTO
  // Endpoint Spring: PUT /api/productos/{id}
  // Headers: Requiere token (se añade automáticamente)
  // Body esperado: { nombre: string, marca: string, fechaCaducidad: date, cantidad: number }
  // Respuesta: { id, nombre, marca, caducidad, cantidad }
  actualizarProducto: async (id, datosActualizados) => {
    return await hacerPeticion(`/api/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        nombre: datosActualizados.nombre,
        marca: datosActualizados.marca,
        fechaCaducidad: datosActualizados.fechaCaducidad,
        cantidad: datosActualizados.cantidad
      })
    });
  },

  // ELIMINAR UN PRODUCTO
  // Endpoint Spring: DELETE /api/productos/{id}
  // Headers: Requiere token (se añade automáticamente)
  // Respuesta: null o { mensaje: "Producto eliminado" }
  eliminarProducto: async (id) => {
    return await hacerPeticion(`/api/productos/${id}`, {
      method: 'DELETE'
    });
  },

  // ============================================
  // ESCÁNER Y BÚSQUEDA DE PRODUCTOS
  // ============================================

  // BUSCAR PRODUCTO POR CÓDIGO DE BARRAS
  // Endpoint Spring: GET /api/alimentos/{codigoBarras}
  // Respuesta: { nombre: string, marca: string, descripcion: string, ... }
  obtenerProductoPorCodigoBarras: async (codigoBarras) => {
    return await hacerPeticion(`/api/alimentos/${codigoBarras}`, {
      method: 'GET'
    });
  },

  // ============================================
  // RECETAS
  // ============================================

  // OBTENER TODAS LAS RECETAS (opcional, para mostrar todas)
  // Endpoint Spring: GET /api/recetas
  // Respuesta: [ { id, titulo, tiempo, dificultad, ingredientes: [], pasos: [] }, ... ]
  obtenerTodasLasRecetas: async () => {
    return await hacerPeticion('/api/recetas', {
      method: 'GET'
    });
  },

  // OBTENER RECETA POR ID
  // Endpoint Spring: GET /api/recetas/{id}
  // Respuesta: { id, titulo, tiempo, dificultad, ingredientes: [], pasos: [], imagen: string }
  obtenerDetalleReceta: async (idReceta) => {
    return await hacerPeticion(`/api/recetas/${idReceta}`, {
      method: 'GET'
    });
  },

  // BUSCAR RECETAS POR INGREDIENTE
  // Endpoint Spring: GET /api/recetas/buscar?ingrediente=xxx
  // Parámetro: ingrediente (nombre del ingrediente a buscar)
  // Respuesta: [ { id, titulo, ingredientes: [], ... }, ... ]
  buscarRecetasPorIngrediente: async (nombreIngrediente) => {
    // Codificar el ingrediente de forma segura para la URL
    const ingredienteSilencio = encodeURIComponent(nombreIngrediente);
    return await hacerPeticion(`/api/recetas/buscar?ingrediente=${ingredienteSilencio}`, {
      method: 'GET'
    });
  },

  // OBTENER RECETAS SUGERIDAS (basadas en productos próximos a caducar)
  // Endpoint Spring: GET /api/recetas/sugeridas
  // Headers: Requiere token (se añade automáticamente)
  // Respuesta: [ { id, titulo, ingredientes: [], proximaCaducar: boolean }, ... ]
  obtenerRecetasSugeridas: async () => {
    return await hacerPeticion('/api/recetas/sugeridas', {
      method: 'GET'
    });
  },

  // ============================================
  // NOTAS IMPORTANTES PARA SPRING
  // ============================================
  // 1. Usar @CrossOrigin en los controllers para permitir peticiones desde React
  // 2. El token JWT debe venir en el header: Authorization: Bearer <token>
  // 3. Los endpoints deben validar el token y asegurarse de que es del usuario correcto
  // 4. Las fechas deben estar en formato ISO (YYYY-MM-DD)
  // 5. Devolver siempre un JSON válido o null si no hay contenido
  // 6. Los códigos HTTP deben ser correctos (200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, etc)
};

