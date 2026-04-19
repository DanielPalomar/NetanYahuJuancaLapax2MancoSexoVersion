import { Link, NavLink, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('token') !== null;

  // No renderizar el Navbar en la página de login o registro
  if (location.pathname === '/login' || location.pathname === '/registro') {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // Clases comunes y activas para los enlaces
  const baseLinkClasses = "transition-colors font-medium";
  const activeLinkClasses = "text-green-600 font-bold border-b-2 border-green-600 pb-1";
  const inactiveLinkClasses = "text-gray-500 hover:text-green-600";

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="bg-green-600 p-1.5 rounded-lg">
          <span className="text-white font-bold text-xl">P</span>
        </div>
        <Link to="/" className="text-xl font-bold text-gray-800">PantryControl</Link>
      </div>
      
      <div className="hidden md:flex items-center space-x-8">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `${baseLinkClasses} ${isActive && location.pathname === '/' ? activeLinkClasses : inactiveLinkClasses}`
          }
        >
          Inicio
        </NavLink>
        <NavLink 
          to="/despensa" 
          className={({ isActive }) => 
            `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
          }
        >
          Despensa
        </NavLink>
        <NavLink 
          to="/recetas" 
          className={({ isActive }) => 
            `${baseLinkClasses} ${isActive || location.pathname.includes('/recetas') ? activeLinkClasses : inactiveLinkClasses}`
          }
        >
          Recetas
        </NavLink>
      </div>

      <div className="flex items-center gap-4">
        {!isAuthenticated ? (
          <Link to="/login" className="text-gray-600 font-medium hover:text-green-600 transition-colors hidden md:block">
            Iniciar Sesión
          </Link>
        ) : (
          <button onClick={handleLogout} className="text-red-500 font-medium hover:text-red-600 transition-colors hidden md:block cursor-pointer">
            Cerrar Sesión
          </button>
        )}
        <Link to="/escanear" className="bg-green-600 text-white px-5 py-2 rounded-full font-medium hover:bg-green-700 transition-all shadow-md">
          Escáner
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
