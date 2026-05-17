/**
 * ugh, la api central. si esto se rompe, se rompe todo.
 * literalmente hace de puente con el backend en spring boot.
 */
let URL_API = 'http://localhost:9090'; // recemos para q siga levantado en el 9090

/**
 * la vieja confiable. le pasas la ruta y reza para que devuelva un 200 ok.
 * maneja el token y los errores comunes para no andar copiando y pegando esto mil veces.
 */
async function hacerPeticion(ruta, opciones) {
  // Si no se pasan opciones, usar un objeto vacío para evitar errores
  if (!opciones) {
    opciones = {};
  }

  // Sacar el token JWT del local storage (lo que guardamos cuando el profe hace login)
  let token = localStorage.getItem('token');

  // Headers por defecto, porque obvio todo es JSON hoy en día
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
    // el fetch de toda la vida apuntando a spring boot
    let respuesta = await fetch(URL_API + ruta, {
      method: opciones.method,
      headers: headers,
      body: opciones.body
    });

    // si da error (ya veo venir el 500 de java)
    if (!respuesta.ok) {
      // Intentar leer el mensaje de error del backend
      let errorData = {};
      try {
        errorData = await respuesta.json();
      } catch (err) {
        alert('Error' + err.message);
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
// OBJETO CON TODOS LOS ENDPOINTS 
// ========================================
export let serviciosAPI = {

  // --- LOGIN ---
  iniciarSesion: async function (credenciales) {
    let body = JSON.stringify({
      username: credenciales.usuario,
      password: credenciales.contraseña
    });
    let resultado = await hacerPeticion('/login', { method: 'POST', body: body });
    return resultado;
  },

  // --- REGISTRAR ---
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
  // trae los productos y traduce los nombres del backend (porque están en inglés)
  obtenerDespensa: async function () {
    let lista = await hacerPeticion('/api/products', { method: 'GET' });
    let resultado = [];
    for (let i = 0; i < lista.length; i++) {
      let p = lista[i];
      // traduccion simple ya que todo está en ingles
      // y el frontend usa nombres en español (nombre, marca, codigoBarras...)
      resultado.push({
        id: p.id,
        nombre: p.name,
        marca: p.brand,
        codigoBarras: p.barcode,
        cantidad: p.cantidad,
        fechaCaducidad: p.fechaCaducidad
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
      fechaCaducidad: fechaCaducidad
    });
    let resultado = await hacerPeticion('/api/products', { method: 'POST', body: body });
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
      fechaCaducidad: fechaCaducidad
    });
    let resultado = await hacerPeticion('/api/products/' + id, { method: 'PUT', body: body });
    return resultado;
  },

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

  obtenerRecetasSugeridas: async function (ingrediente) {
    let res = await hacerPeticion('/api/recipes/ingredients?ingredient=' + ingrediente, { method: 'GET' });
    
    // Si no hay respuesta, devolvemos lista vacía para que no pete el .map()
    if (!res || !res.meals) {
      return [];
    }
    
    let meals = res.meals;
    let resultado = [];
    for (let i = 0; i < meals.length; i++) {
      let r = meals[i];

      // Recopilar ingredientes que no estén vacíos
      let ingredientes = [];
      for (let j = 1; j <= 20; j++) {
        let ing = r['strIngredient' + j];
        let measure = r['strMeasure' + j];
        if (ing && ing.trim() !== "") {
          if (measure) {
            ingredientes.push(measure + ' de ' + ing);
          } else {
            ingredientes.push(ing);
          }
        }
      }

      resultado.push({
        id: r.idMeal,
        titulo: r.strMeal,
        instrucciones: r.strInstructions,
        imagen: r.strMealThumb,
        ingredientes: ingredientes,
        tiempo: "N/A",
        dificultad: "N/A"
      });
    }
    return resultado;
  },



  // --- ADMIN ---
  // trae los usuarios y chequea a manopla quien es admin (super ineficiente pero anda)
  obtenerUsuariosAdmin: async function () {
    let lista = await hacerPeticion('/api/users/admin', { method: 'GET' });
    if (!lista) return [];
    
    let resultado = [];
    for (let i = 0; i < lista.length; i++) {
      let u = lista[i];
      // Recorrer los roles del usuario para ver si tiene ROLE_ADMIN
      let esAdmin = false;
      if (u.roles) {
        for (let j = 0; j < u.roles.length; j++) {
          if (u.roles[j].name === 'ROLE_ADMIN') {
            esAdmin = true;
          }
        }
      }
      resultado.push({
        id: u.id,
        usuario: u.username,
        correo: u.email,
        esAdministrador: esAdmin,
        estaActivo: u.enabled
      });
    }
    return resultado;
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