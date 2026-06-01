let URL_API = 'https://tu-despensa-back.onrender.com'; // apuntamos al back subida en render

async function hacerPeticion(ruta, opciones = {}) {
  // Sacar el token JWT del local storage 
  let token = localStorage.getItem('token');

  // Headers por defecto
  let headers = {
    'Content-Type': 'application/json'
  };

  // Si hay token, añadirlo a las cabeceras
  if (token) {
    headers['Authorization'] = 'Bearer ' + token;
  }

  // por si llegan varias cabezeras copiarlas una por una al objeto headers
  if (opciones.headers) {
    let claves = Object.keys(opciones.headers);
    for (let i = 0; i < claves.length; i++) {
      headers[claves[i]] = opciones.headers[claves[i]];
    }
  }

  try {
    // el fetch apuntando a spring boot
    let respuesta = await fetch(URL_API + ruta, {
      method: opciones.method,
      headers: headers,
      body: opciones.body
    });

    // si da error
    if (!respuesta.ok) {
      // Intentar leer el mensaje de error del backend
      let errorData = {};
      try {
        errorData = await respuesta.json();
      } catch (err) {
        // Si la respuesta no es JSON, no pasa nada, simplemente usamos el código de estado
        console.error('La respuesta del servidor no es JSON:', err.message);
      }
      let mensaje = errorData.mensaje || errorData.message || 'Error: ' + respuesta.status;
      throw new Error(mensaje);
    }

    // Lee la respuesta y devuelve un JSON
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
// OBJETO CON TODOS LOS ENDPOINTS 
// ========================================
export let serviciosAPI = {

  // --- LOGIN ---
  async iniciarSesion(credenciales) {
    let body = JSON.stringify({
      username: credenciales.usuario,
      password: credenciales.contraseña
    });
    let resultado = await hacerPeticion('/login', { method: 'POST', body: body });
    return resultado;
  },

  // --- REGISTRo ---
  registrarUsuario: async function (datos) {
    let body = JSON.stringify({
      name: datos.nombre,
      lastname: datos.apellido,
      username: datos.usuario,
      email: datos.correo,
      password: datos.contraseña,
      admin: datos.admin
    });
    let resultado = await hacerPeticion('/api/users/register', { method: 'POST', body: body });
    return resultado;
  },

  // --- DESPENSA ---
  // trae los productos y traduce los nombres del backend (porque están en inglés) tipo un diccionario 
  async obtenerDespensa() {
    let lista = await hacerPeticion('/api/products', { method: 'GET' }) || [];
    let productos = lista.map(p => ({
      id: p.id,
      nombre: p.name,
      marca: p.brand,
      codigoBarras: p.barcode,
      cantidad: p.cantidad,
      fechaCaducidad: p.fechaCaducidad
    }));

    // Ordenar por fecha de caducidad: los que caducan antes van primero, los que no tienen fecha van al final
    productos.sort(function (a, b) {
      if (!a.fechaCaducidad && !b.fechaCaducidad) return 0;
      if (!a.fechaCaducidad) return 1;  // sin fecha va al final
      if (!b.fechaCaducidad) return -1; // sin fecha va al final
      return new Date(a.fechaCaducidad) - new Date(b.fechaCaducidad);
    });

    return productos;
  },

  // insertar productos 
  async anadirProducto(p) {
    let cantidad = parseInt(p.cantidad) || 1;
    let body = JSON.stringify({
      name: p.nombre,
      brand: p.marca,
      barcode: p.codigoBarras || null,
      cantidad: cantidad,
      fechaCaducidad: p.fechaCaducidad || null
    });
    let resultado = await hacerPeticion('/api/products', { method: 'POST', body: body });
    return resultado;
  },

  // actualiza productos
  async actualizarProducto(id, p) {
    let cantidad = parseInt(p.cantidad) || 1;
    let body = JSON.stringify({
      name: p.nombre,
      brand: p.marca,
      barcode: p.codigoBarras || null,
      cantidad: cantidad,
      fechaCaducidad: p.fechaCaducidad || null
    });
    let resultado = await hacerPeticion('/api/products/' + id, { method: 'PUT', body: body });
    return resultado;
  },

  // elimina productos 
  eliminarProducto: async function (id) {
    let resultado = await hacerPeticion('/api/products/' + id, { method: 'DELETE' });
    return resultado;
  },

  obtenerProductoPorCodigoBarras: async function (barcode) {
    let p = await hacerPeticion('/api/food/' + barcode, { method: 'GET' });
    if (!p) {
      return null;
    }
    return {
      nombre: p.name,
      marca: p.brand,
      codigoBarras: p.barcode,
      cantidad: p.cantidad
    };
  },

  async obtenerRecetasSugeridas(ingrediente) {
    // encodeURIComponent para que caracteres especiales (tildes, ñ, espacios) no rompan la URL
    let res = await hacerPeticion('/api/recipes/ingredients?ingredient=' + encodeURIComponent(ingrediente), { method: 'GET' });
    let meals = res.meals || [];

    return meals.map(r => {
      let ingredientes = [];
      for (let j = 1; j <= 20; j++) {
        let ing = r['strIngredient' + j];
        let measure = r['strMeasure' + j];
        if (ing && ing.trim() !== "") {
          ingredientes.push(measure ? `${measure} de ${ing}` : ing);
        }
      }

      return {
        id: r.idMeal,
        titulo: r.strMeal,
        instrucciones: r.strInstructions,
        imagen: r.strMealThumb,
        ingredientes: ingredientes,
        tiempo: "N/A",
        dificultad: "N/A"
      };
    });
  },

  // --- ADMIN ---
  // trae los usuarios y revisa quien es admin
  async obtenerUsuariosAdmin() {
    let lista = await hacerPeticion('/api/users/admin', { method: 'GET' }) || [];
    return lista.map(u => ({
      id: u.id,
      usuario: u.username,
      correo: u.email,
      esAdministrador: u.roles.some(rol => rol.name === 'ROLE_ADMIN'),
      estaActivo: u.enabled
    }));
  },

  activarUsuarioAdmin: async function (id) {
    let resultado = await hacerPeticion('/api/users/admin/' + id, { method: 'POST' });
    return resultado;
  },

  eliminarUsuarioAdmin: async function (id) {
    let resultado = await hacerPeticion('/api/users/admin/' + id, { method: 'DELETE' });
    return resultado;
  }
};