import { useState } from 'react';
import { Link } from 'react-router-dom';
import { serviciosAPI } from '../services/servicios';

function Ingreso() {
  let [usuario, setUsuario] = useState('');
  let [contraseña, setContraseña] = useState('');
  let [error, setError] = useState(null);

  function enviar(e) {
    e.preventDefault();
    serviciosAPI.iniciarSesion({ usuario, contraseña }).then(function (respuesta) {
      localStorage.setItem('token', respuesta.token);
      localStorage.setItem('esAdministrador', respuesta.esAdministrador ? 'true' : 'false');
      window.location.href = '/despensa';
    }).catch(function () {
      setError('Error al iniciar sesión');
    });
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-emerald-50 px-4">
      <div className="w-full max-w-md bg-white p-10 rounded-[2rem] shadow-sm border border-emerald-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-emerald-950 mb-2 tracking-tight">Bienvenido</h2>
          <p className="text-emerald-600/80">Accede a tu despensa para continuar</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={enviar} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-emerald-900 mb-2">Usuario</label>
            <input
              type="text" required
              placeholder="Tu usuario"
              className="w-full px-4 py-3 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
              value={usuario}
              // el focus es para cuando se selecciona algo y le cambia las cositas 
              onChange={(e) => setUsuario(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-emerald-900 mb-2">Contraseña</label>
            <input
              type="password" required
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white font-semibold py-3.5 rounded-xl hover:bg-emerald-700 transition-colors mt-2 shadow-sm shadow-emerald-200"
          >
            Entrar
          </button>
        </form>

        <p className="text-center text-emerald-600/80 mt-8">
          ¿No tienes cuenta? <Link to="/registro" className="text-emerald-700 font-semibold hover:text-emerald-800 transition-colors">Crear una</Link>
        </p>
      </div>
    </div>
  );
}

export default Ingreso;
