import { Outlet } from 'react-router-dom';
import Barra from '../components/Navbar';

// Layout Principal
function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col transition-colors">

      {/* Menú de navegación global */}
      <Barra />

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Pie de página final */}
      <footer className="py-6 text-center text-gray-400 dark:text-gray-500 text-sm border-t border-gray-50 dark:border-gray-800 mt-auto">
        <p>© 2026 La Despensa de Lapa | Grupo Puente4</p>
      </footer>
    </div>
  );
}

export default MainLayout;
