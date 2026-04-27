import { Link, useLocation } from 'react-router-dom';
import { Store } from 'lucide-react';
import ThemeToggle from './ThemeToggle';


// Barra de navegación principal 
//lapa............
function Barra() {
  const ubicacion = useLocation();
  const tieneToken = localStorage.getItem('token') !== null;
  const esAdministrador = localStorage.getItem('esAdministrador') === 'true';

  if (ubicacion.pathname === '/login' || ubicacion.pathname === '/registro') {
    return null;
  }

  function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('esAdministrador');
    window.location.href = '/login';
  }

  //colores para los enlaces
  let claseComun = "font-medium transition-colors text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400";
  let claseActiva = "font-medium transition-colors text-green-600 dark:text-green-400";

  let claseInicio = ubicacion.pathname === '/' ? claseActiva : claseComun;
  let claseDespensa = ubicacion.pathname === '/despensa' ? claseActiva : claseComun;
  let claseRecetas = ubicacion.pathname === '/recetas' ? claseActiva : claseComun;

  let claseAdmin = "font-bold transition-colors text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300";
  if (ubicacion.pathname === '/admin') {
    claseAdmin = "font-bold transition-colors text-green-700 dark:text-green-300";
  }


  //botón de sesión
  let botonSesion;
  if (!tieneToken) {
    botonSesion = (
      <Link
        to="/login"
        className="text-white bg-green-600 hover:bg-green-700 px-5 py-2 rounded-md font-medium transition-colors hidden md:block"
      >
        Iniciar Sesión
      </Link>
    );
  } else {
    botonSesion = (
      <button
        onClick={cerrarSesion}
        className="text-gray-500 hover:text-red-600 font-medium transition-colors hidden md:block"
      >
        Cerrar Sesión
      </button>
    );
  }

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm transition-colors">
      {/* Logo y nombre */}
      <div className="flex items-center gap-3">
        <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg border border-green-100 dark:border-green-800/30">
          <Store className="text-green-600 dark:text-green-400" size={24} />
        </div>
        <Link to="/" className="text-xl font-extrabold text-gray-800 dark:text-white tracking-tight hover:text-green-700 dark:hover:text-green-400 transition-colors">
          La Despensa de Lapa
        </Link>
      </div>


      {/* Enlaces principales */}
      <div className="hidden md:flex items-center space-x-8">
        <Link to="/" className={claseInicio}>
          Inicio
        </Link>

        {tieneToken && (
          <Link to="/despensa" className={claseDespensa}>
            Mi Despensa
          </Link>
        )}

        {tieneToken && (
          <Link to="/recetas" className={claseRecetas}>
            Recetario
          </Link>
        )}

        {esAdministrador && (
          <Link to="/admin" className={claseAdmin}>
            Panel Admin
          </Link>
        )}
      </div>

      {/* Botones de sesión y tema */}
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {botonSesion}
      </div>

    </nav>
  );
}

export default Barra;
