import { Outlet, Link } from 'react-router-dom';
import { Store } from 'lucide-react';

// Layout de Autenticación
function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors">
      {/* Encabezado */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8 text-center">
        <Link to="/" className="inline-flex items-center gap-3 justify-center mb-6 hover:opacity-80 transition-opacity">
          <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-xl border border-green-200 dark:border-green-800/30">
            <Store className="text-green-600 dark:text-green-400" size={32} />
          </div>
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          La Despensa de Lapa
        </h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
