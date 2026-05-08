import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { serviciosAPI } from '../services/servicios';

/**
 * PÁGINA DE REGISTRO 
 */
function Registro() {
  let navegar = useNavigate();
  let [nombre, setNombre] = useState('');
  let [apellido, setApellido] = useState('');
  let [usuario, setUsuario] = useState('');
  let [correo, setCorreo] = useState('');
  let [contraseña, setContraseña] = useState('');
  let [error, setError] = useState(null);

  function enviar(e) {
    e.preventDefault();
    serviciosAPI.registrarUsuario({
      nombre: nombre,
      apellido: apellido,
      usuario: usuario,
      correo: correo,
      contraseña: contraseña
    }).then(function() {
      navegar('/login');
    }).catch(function() {
      setError('Error');
    });
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50 px-4 py-8">
      <div className="w-full max-w-md bg-white p-8 border border-blue-200 rounded">
        <h2 className="text-3xl font-bold mb-2 text-blue-900">Crear cuenta</h2>
        <p className="text-slate-700 text-sm mb-6">Únete a la mejor despensa</p>

        {error && (
          <div className="bg-red-100 text-red-800 p-4 mb-4 text-sm border border-red-300 rounded">
            {error}
          </div>
        )}

        <form onSubmit={enviar} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre</label>
              <input
                type="text" required
                placeholder="Mario"
                className="w-full px-4 py-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
                value={nombre}
                onChange={function(e) { setNombre(e.target.value); }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Apellido</label>
              <input
                type="text" required
                placeholder="Marugan"
                className="w-full px-4 py-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
                value={apellido}
                onChange={function(e) { setApellido(e.target.value); }}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Usuario</label>
            <input
              type="text" required
              placeholder="mariomarugan"
              className="w-full px-4 py-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
              value={usuario}
              onChange={function(e) { setUsuario(e.target.value); }}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Correo</label>
            <input
              type="email" required
              placeholder="correo@ejemplo.com"
              className="w-full px-4 py-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
              value={correo}
              onChange={function(e) { setCorreo(e.target.value); }}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Contraseña</label>
            <input
              type="password" required
              placeholder="*****"
              className="w-full px-4 py-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
              value={contraseña}
              onChange={function(e) { setContraseña(e.target.value); }}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 mt-4"
          >
            Crear cuenta
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          Inicia ya  <Link to="/login" className="text-blue-600 font-semibold">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default Registro;
