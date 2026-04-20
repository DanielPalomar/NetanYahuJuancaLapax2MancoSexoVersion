import { Link, useLocation } from 'react-router-dom';

// Barra de navegación simple - Marcos la controla todo
const Barra = () => {
  // Hook para saber dónde estamos
  const ubicacion = useLocation();
  // Verificamos si el usuario tiene token
  const tieneToken = localStorage.getItem('token') !== null;

  // No mostramos barra en login ni registro
  if (ubicacion.pathname === '/login' || ubicacion.pathname === '/registro') {
    return null;
  }

  // Función para cerrar sesión
  const cerrarSesion = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm px-6 py-4 flex justify-between items-center">
      {/* Logo y nombre */}
      <div className="flex items-center gap-2">
        <div className="bg-green-600 p-1.5 rounded-lg">
          <span className="text-white font-bold text-xl">MancoNoob</span>
        </div>
        <Link to="/" className="text-xl font-bold text-gray-800">Esto se cambia luego</Link>
      </div>
      
      {/* Enlaces principales (solo en pantallas grandes) */}
      <div className="hidden md:flex items-center space-x-8">
        <Link to="/" className="text-gray-500 hover:text-green-600 transition-colors font-medium">
          Inicio
        </Link>
        <Link to="/despensa" className="text-gray-500 hover:text-green-600 transition-colors font-medium">
          Despensa
        </Link>
        <Link to="/recetas" className="text-gray-500 hover:text-green-600 transition-colors font-medium">
          Recetario de la abuela
        </Link>
      </div>

      {/* Botones de sesión y escáner */}
      <div className="flex items-center gap-4">
        {!tieneToken ? (
          // Si no hay token, mostramos botón de iniciar sesión
          <Link to="/login" className="text-gray-600 font-medium hover:text-green-600 transition-colors hidden md:block">
            Iniciar Sesión
          </Link>
        ) : (
          // Si hay token, mostramos botón de cerrar sesión
          <button onClick={cerrarSesion} className="text-red-500 font-medium hover:text-red-600 transition-colors hidden md:block cursor-pointer">
            Cerrar Sesión
          </button>
        )}
        {/* Botón de escáner (siempre visible) */}
        <Link to="/escanear" className="bg-green-600 text-white px-5 py-2 rounded-full font-medium hover:bg-green-700 transition-all shadow-md">
          Escanearr
        </Link>
      </div>
    </nav>
  );
};

export default Barra;
