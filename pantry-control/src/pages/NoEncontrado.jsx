import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

/**
 * PÁGINA 404 "Lapans"
 */
function NoEncontrado() {
  return (
    // Contenedor principal
    <div className="flex items-center justify-center min-h-screen bg-blue-50 p-4">

      {/*Tarjeta blanca*/}
      <div className="max-w-md w-full bg-white p-8 border border-blue-200 rounded-lg shadow-sm text-center">

        <div className="text-6xl font-bold text-blue-200 mb-4">404</div>

        <h1 className="text-2xl font-bold text-blue-900 mb-2">
          Página no encontrada
        </h1>

        <p className="text-slate-600 mb-8">
          La página que buscas no existe o ha sido movida.
        </p>

        <Link
          to="/"
          className="inline-block bg-blue-600 text-white px-8 py-3 font-semibold rounded-md hover:bg-blue-700 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
export default NoEncontrado;
