import { useState } from 'react';
import { Link } from 'react-router-dom';
import { serviciosAPI } from '../services/servicios';

function Ingreso() {
  let [usuario, setUsuario] = useState('');
  let [contraseña, setContraseña] = useState('');
  let [error, setError] = useState(null);

  function enviar(e) {
    e.preventDefault();
    serviciosAPI.iniciarSesion({ usuario, contraseña }).then(function(respuesta) {
      localStorage.setItem('token', respuesta.token);
      localStorage.setItem('esAdministrador', respuesta.esAdministrador ? 'true' : 'false');
      window.location.href = '/despensa';
    }).catch(function() {
      setError('Error');
    });
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white p-8 border border-gray-300">
        <h2 className="text-3xl font-bold mb-2 text-gray-800">Iniciar sesión</h2>
        <p className="text-gray-600 text-sm mb-6">Accede a tu despensa</p>

        {error && (
          <div className="bg-red-100 text-red-800 p-4 mb-4 text-sm border border-red-300">
            {error}
          </div>
        )}

        <form onSubmit={enviar} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Usuario</label>
            <input
              type="text" required
              placeholder="Tu usuario"
              className="w-full px-4 py-2 border border-gray-300"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
            <input
              type="password" required
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 hover:bg-blue-700"
          >
            Entrar
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          ¿No tienes cuenta? <Link to="/registro" className="text-blue-600 font-semibold">Crear una</Link>
        </p>
      </div>
    </div>
  );
}

export default Ingreso;
