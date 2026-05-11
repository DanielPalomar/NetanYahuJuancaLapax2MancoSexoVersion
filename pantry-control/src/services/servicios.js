/**
 * CONFIGURACIÓN CENTRAL DE LA API
 * Gestiona todas las comunicaciones con el backend Spring Boot.
 */
let URL_API = 'http://localhost:9090';

/**
 * Función base para realizar peticiones HTTP.
 * Maneja automáticamente el token de seguridad y los errores comunes.
 */
async function hacerPeticion(ruta, opciones) {
  // Si no se pasan opciones, usar un objeto vacío para evitar errores
  if (!opciones) {
    opciones = {};
  }

  // Sacar el token JWT del navegador (se guarda al hacer login)
  let token = localStorage.getItem('token');

  // Cabeceras que se envían en cada petición al backend
  let headers = {
    'Content-Type': 'application/json'
  };

  // Si hay token, añadirlo a las cabeceras para que el backend sepa quién somos
  if (token) {
    headers['Authorization'] = 'Bearer ' + token;
  }

  // Si la petición trae cabeceras extra, copiarlas una por una al objeto headers
  if (opciones.headers) {
    let claves = Object.keys(opciones.headers);
    for (let i = 0; i < claves.length; i++) {
      headers[claves[i]] = opciones.headers[claves[i]];
    }
  }

  try {
    let respuesta = await fetch(URL_API + ruta, {
      method: opciones.method,
      headers: headers,
      body: opciones.body
    });

    // Si el servidor responde con error (400, 401, 500, etc.)
    if (!respuesta.ok) {
      // Intentar leer el mensaje de error del backend
      let errorData = {};
      try {
        errorData = await respuesta.json();
      } catch (err) {
       alert('Error'+ err.message);
      }
      let mensaje = errorData.mensaje;
      if (!mensaje) {
        mensaje = 'Error: ' + respuesta.status;
      }
      throw new Error(mensaje);
    }

    // Leer la respuesta como texto y convertir a JSON
    // Se hace así porque algunas respuestas (como DELETE) vienen vacías
    let texto = await respuesta.text();
    if (texto) {
      return JSON.parse(texto);
    }
    return null;
  } catch (error) {
    console.error('Error en la petición ' + ruta + ':', error);
    throw error;
  }
}

// ========================================
// OBJETO CON TODOS LOS SERVICIOS
// ========================================
export let serviciosAPI = {

  // --- AUTENTICACIÓN ---
  iniciarSesion: async function (credenciales) {
    let body = JSON.stringify({
      username: credenciales.usuario,
      password: credenciales.contraseña
    });
    let resultado = await hacerPeticion('/login', { method: 'POST', body: body });
    return resultado;
  },

  registrarUsuario: async function (datos) {
    let body = JSON.stringify({
      name: datos.nombre,
      lastname: datos.apellido,
      username: datos.usuario,
      email: datos.correo,
      password: datos.contraseña,
      admin: datos.admin
    });
    let resultado = await hacerPeticion('/api/usuarios/registrar', { method: 'POST', body: body });
    return resultado;
  },

  // --- GESTIÓN DE PRODUCTOS (DESPENSA) ---
  // Obtiene todos los productos del usuario y traduce los nombres del backend (inglés) al frontend (español)
  obtenerDespensa: async function () {
    let lista = await hacerPeticion('/api/productos', { method: 'GET' });
    let resultado = [];
    for (let i = 0; i < lista.length; i++) {
      let p = lista[i];
      // Mapeo: el backend usa nombres en inglés (name, brand, barcode...)
      // y el frontend usa nombres en español (nombre, marca, codigoBarras...)
      resultado.push({
        id: p.id,
        nombre: p.name,
        marca: p.brand,
        codigoBarras: p.barcode,
        cantidad: p.cantidad,
        fechaCaducidad: p.expirationDate,
        url_image: p.url_image
      });
    }
    return resultado;
  },

  anadirProducto: async function (p) {
    let cantidad = parseInt(p.cantidad);
    if (!cantidad) {
      cantidad = 1;
    }
    let codigoBarras = p.codigoBarras;
    if (!codigoBarras) {
      codigoBarras = null;
    }
    let fechaCaducidad = p.fechaCaducidad;
    if (!fechaCaducidad) {
      fechaCaducidad = null;
    }
    let body = JSON.stringify({
      name: p.nombre,
      brand: p.marca,
      barcode: codigoBarras,
      cantidad: cantidad,
      expirationDate: fechaCaducidad,
      url_image: p.url_image
    });
    let resultado = await hacerPeticion('/api/productos', { method: 'POST', body: body });
    return resultado;
  },

  actualizarProducto: async function (id, p) {
    let cantidad = parseInt(p.cantidad);
    if (!cantidad) {
      cantidad = 1;
    }
    let codigoBarras = p.codigoBarras;
    if (!codigoBarras) {
      codigoBarras = null;
    }
    let fechaCaducidad = p.fechaCaducidad;
    if (!fechaCaducidad) {
      fechaCaducidad = null;
    }
    let body = JSON.stringify({
      name: p.nombre,
      brand: p.marca,
      barcode: codigoBarras,
      cantidad: cantidad,
      expirationDate: fechaCaducidad,
      url_image: p.url_image
    });
    let resultado = await hacerPeticion('/api/productos/' + id, { method: 'PUT', body: body });
    return resultado;
  },

  eliminarProducto: async function (id) {
    let resultado = await hacerPeticion('/api/productos/' + id, { method: 'DELETE' });
    return resultado;
  },

  obtenerProductoPorCodigoBarras: async function (barcode) {
    let p = await hacerPeticion('/api/alimentos/' + barcode, { method: 'GET' });
    if (!p) {
      return null;
    }
    return {
      nombre: p.name,
      marca: p.brand,
      codigoBarras: p.barcode,
      cantidad: p.cantidad,
      url_image: p.url_image
    };
  },

  // --- RECETAS ---
  obtenerRecetasSugeridas: async function () {
    let res = await hacerPeticion('/api/recetas/sugeridas', { method: 'GET' });
    let meals = res.meals;
    if (!meals) {
      meals = [];
    }
    let resultado = [];
    for (let i = 0; i < meals.length; i++) {
      let r = meals[i];
      let ingredientes = r.ingredientes;
      if (!ingredientes) {
        ingredientes = [];
      }
      resultado.push({
        id: r.id,
        titulo: r.titulo,
        instrucciones: r.pasos,
        imagen: r.imagen,
        ingredientes: ingredientes,
        tiempo: r.tiempo,
        dificultad: r.dificultad
      });
    }
    return resultado;
  },

  obtenerDetalleReceta: async function (id) {
    let r = await hacerPeticion('/api/recetas/' + id, { method: 'GET' });
    let ingredientes = r.ingredientes;
    if (!ingredientes) {
      ingredientes = [];
    }
    return {
      id: r.id,
      titulo: r.titulo,
      instrucciones: r.pasos,
      imagen: r.imagen,
      ingredientes: ingredientes,
      tiempo: r.tiempo,
      dificultad: r.dificultad
    };
  },

  // --- PANEL DE ADMINISTRACIÓN ---
  // Obtiene la lista de usuarios y comprueba si cada uno es admin
  obtenerUsuariosAdmin: async function () {
    let lista = await hacerPeticion('/api/usuarios', { method: 'GET' });
    let resultado = [];
    for (let i = 0; i < lista.length; i++) {
      let u = lista[i];
      // Recorrer los roles del usuario para ver si tiene ROLE_ADMIN
      let esAdmin = false;
      for (let j = 0; j < u.roles.length; j++) {
        if (u.roles[j].name === 'ROLE_ADMIN') {
          esAdmin = true;
        }
      }
      resultado.push({
        id: u.id,
        usuario: u.username,
        correo: u.email,
        esAdministrador: esAdmin
      });
    }
    return resultado;
  },

  eliminarUsuarioAdmin: async function (id) {
    let resultado = await hacerPeticion('/api/usuarios/' + id, { method: 'DELETE' });
    return resultado;
  }
};
