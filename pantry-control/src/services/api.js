// Configuración base de la API
const API_URL = 'http://localhost:8080'; // Ajusta esto a la URL y puerto real de tu backend

// Función auxiliar (interceptor) para peticiones
// Si guardas un token JWT tras el login, esto lo inyectará automáticamente en las cabeceras
const fetchAPI = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token'); // Asumimos que se guarda en localStorage
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      // Manejo de errores genérico
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error en la petición: ${response.status}`);
    }

    // Algunas respuestas (como un DELETE exitoso o un login que no devuelve JSON) 
    // podrían fallar al parsear JSON, por lo que controlamos si hay contenido
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error(`Error en API (${endpoint}):`, error);
    throw error;
  }
};

export const apiServices = {
  // ----------------------------------------------------
  // Autenticación y Usuarios
  // ----------------------------------------------------
  
  // Login de usuario (según excel: POST login)
  loginUser: async (credentials) => {
    // Si el login es un Form-Data y no JSON, habría que cambiar los headers aquí
    return await fetchAPI('/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  // Registro de usuario (según excel: POST api/users/register)
  registerUser: async (userData) => {
    return await fetchAPI('/api/users/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  // ----------------------------------------------------
  // Gestión de Despensa (Productos)
  // ----------------------------------------------------

  // Obtener los productos (según excel: GET api/products devuelve los productos del userLog)
  getPantry: async () => {
    return await fetchAPI('/api/products', {
      method: 'GET'
    });
  },

  // Añadir un nuevo producto a la despensa (según excel: POST api/products)
  addProduct: async (productData) => {
    return await fetchAPI('/api/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  // Actualizar un producto (según excel: PUT api/products/{id})
  updateProduct: async (id, updatedData) => {
    return await fetchAPI(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedData)
    });
  },

  // Eliminar un producto (según excel: DELETE api/products/{id})
  deleteProduct: async (id) => {
    return await fetchAPI(`/api/products/${id}`, {
      method: 'DELETE'
    });
  },

  // ----------------------------------------------------
  // Escáner y Alimentos Globales
  // ----------------------------------------------------

  // Buscar información de un producto por código de barras (según excel: GET api/food/{barcode})
  getProductByBarcode: async (barcode) => {
    return await fetchAPI(`/api/food/${barcode}`, {
      method: 'GET'
    });
  },

  // ----------------------------------------------------
  // Recetas
  // ----------------------------------------------------

  // Buscar recetas por ingrediente (según excel: GET api/recipes/ingredient?ingrediente=xxx)
  getRecipesByIngredient: async (ingredientName) => {
    // Codificamos el nombre del ingrediente para que sea seguro en la URL
    const safeIngredient = encodeURIComponent(ingredientName);
    return await fetchAPI(`/api/recipes/ingredient?ingrediente=${safeIngredient}`, {
      method: 'GET'
    });
  }
};
