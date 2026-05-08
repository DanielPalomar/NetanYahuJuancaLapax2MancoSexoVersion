import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

/**
 * PÁGINA 404 "Lapans"
 */
function NoEncontrado() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50 p-8">
      <div className="max-w w-full bg-white p-8 border border-blue-200 rounded text-center">
        <div className="text-6xl font-bold text-blue-200 mb-4">404</div>
        <h1 className="text-2xl font-bold text-blue-900 mb-2">Página no encontrada</h1>
        <p className="text-slate-600 mb-6">La página que buscas no existe.</p>
        <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-2 font-semibold rounded hover:bg-blue-700">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

export default NoEncontrado;
