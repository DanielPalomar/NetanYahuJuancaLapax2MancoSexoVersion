import { Link } from 'react-router-dom';

// Esta página sale cuando la ruta no existe
function NoEncontrado() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-5 text-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Página no encontrada
      </h1>
      {/* Mensaje*/}
      <p className="text-gray-500 mb-6">
        La página que buscas no existe o ha sido movida.
      </p>

      {/* Botón */}
      <Link
        to="/"
        className="bg-emerald-600 text-white px-6 py-2 rounded-md font-bold"
      >
        Volver al inicio
      </Link>

    </div>
  );
}

export default NoEncontrado;
