/**
 * CONFIGURACIÓN CENTRAL DE LA API
 * Aquí gestionamos todas las peticiones al backend de Spring Boot.
 * Hemos implementado seguridad, manejo de errores y mapeo de datos.
 */
const URL_API = 'http://localhost:9090';

/**
 * FUNCIÓN BASE PARA PETICIONES (INTERCEPTOR)
 * Centraliza la lógica de headers, autenticación y errores.
 */
const hacerPeticion = async (ruta, opciones = {}) => {
  const token = localStorage.getItem('token');
  
  const encabezados = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...opciones.headers,
  };

  try {
    const respuesta = await fetch(`${URL_API}${ruta}`, {
      ...opciones,
      headers: encabezados,
    });

    // Manejo de errores HTTP (ej: 401 Unauthorized, 400 Bad Request)
    if (!respuesta.ok) {
      const datosError = await respuesta.json().catch(() => ({}));
      throw new Error(datosError.mensaje || `Error ${respuesta.status}`);
    }

    const texto = await respuesta.text();
    return texto ? JSON.parse(texto) : null;
  } catch (error) {
    console.error(`❌ Fallo en: ${ruta}`, error);
    throw error;
  }
};

export const serviciosAPI = {
  
  /** 
   * AUTENTICACIÓN
   */
  iniciarSesion: async (credenciales) => {
    return await hacerPeticion('/login', {
      method: 'POST',
      body: JSON.stringify({
        username: credenciales.usuario,
        password: credenciales.contraseña
      })
    });
  },

  registrarUsuario: async (datosUsuario) => {
    return await hacerPeticion('/api/usuarios/registrar', {
      method: 'POST',
      body: JSON.stringify({
        name: datosUsuario.nombre,
        lastname: datosUsuario.apellido,
        username: datosUsuario.usuario,
        email: datosUsuario.correo,
        password: datosUsuario.contraseña
      })
    });
  },

  /**
   * GESTIÓN DE PRODUCTOS
   */
  obtenerDespensa: async () => {
    const lista = await hacerPeticion('/api/productos', { method: 'GET' });
    // MAPEO HUMANO: Convertimos los nombres del Backend (Inglés) a nuestro sistema (Español)
    return lista.map(p => ({
      id: p.id,
      nombre: p.name,
      marca: p.brand,
      codigoBarras: p.barcode,
      cantidad: p.weight,
      fechaCaducidad: p.expirationDate,
      url_image: p.url_image
    }));
  },

  anadirProducto: async (datos) => {
    return await hacerPeticion('/api/productos', {
      method: 'POST',
      body: JSON.stringify({
        name: datos.nombre,
        brand: datos.marca,
        // FIX: Enviamos 'null' si está vacío para evitar errores de duplicados en DB
        barcode: datos.codigoBarras || null,
        weight: parseFloat(datos.cantidad) || 0,
        // FIX: Enviamos 'null' para que Java LocalDate no explote con textos vacíos
        expirationDate: datos.fechaCaducidad || null,
        url_image: datos.url_image
      })
    });
  },

  actualizarProducto: async (id, datos) => {
    return await hacerPeticion(`/api/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: datos.nombre,
        brand: datos.marca,
        barcode: datos.codigoBarras || null,
        weight: parseFloat(datos.cantidad) || 0,
        expirationDate: datos.fechaCaducidad || null,
        url_image: datos.url_image
      })
    });
  },

  eliminarProducto: async (id) => {
    return await hacerPeticion(`/api/productos/${id}`, { method: 'DELETE' });
  },

  /**
   * RECETARIO Y SUGERENCIAS
   */
  obtenerRecetasSugeridas: async () => {
    const res = await hacerPeticion('/api/recetas/sugeridas', { method: 'GET' });
    const lista = res.recetas || res.meals || [];
    // TRADUCCIÓN DE CAMPOS: Soportamos tanto llaves en inglés como en español
    return lista.map(r => ({
      id: r.id || r.idMeal,
      titulo: r.titulo || r.strMeal,
      instrucciones: r.pasos || r.strInstructions,
      imagen: r.imagen || r.strMealThumb,
      ingredientes: r.ingredientes || [],
      tiempo: r.tiempo || "25 min",
      dificultad: r.dificultad || "Fácil"
    }));
  },

  obtenerDetalleReceta: async (id) => {
    const r = await hacerPeticion(`/api/recetas/${id}`, { method: 'GET' });
    return {
      id: r.id || r.idMeal,
      titulo: r.titulo || r.strMeal,
      instrucciones: r.pasos || r.strInstructions,
      imagen: r.imagen || r.strMealThumb,
      ingredientes: r.ingredientes || [],
      tiempo: r.tiempo || "30 min",
      dificultad: r.dificultad || "Media"
    };
  },

  /**
   * ADMINISTRACIÓN (SOLO ADMINS)
   */
  obtenerUsuariosAdmin: async () => {
    return await hacerPeticion('/api/usuarios', { method: 'GET' });
  },

  eliminarUsuarioAdmin: async (id) => {
    return await hacerPeticion(`/api/usuarios/${id}`, { method: 'DELETE' });
  }
};


