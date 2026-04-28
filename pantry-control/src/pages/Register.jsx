import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, ArrowRight } from 'lucide-react';
import { serviciosAPI } from '../services/api';

// Página de registro
function Registro() {
  const navegar = useNavigate();

  // Datos del formulario
  const [datos, setDatos] = useState({
    nombre: '',
    apellido: '',
    usuario: '',
    correo: '',
    contraseña: ''
  });

  // Control de carga
  const [cargando, setCargando] = useState(false);
  // Mensaje de error
  const [error, setError] = useState(null);

  // Función para enviar el formulario
  async function enviar(e) {
    e.preventDefault();
    setCargando(true);
    setError(null);

    try {
      // Llamada al back
      await serviciosAPI.registrarUsuario(datos);

      // Redirigimos a login
      navegar('/login');
    } catch (err) {
      setError('Hubo un error al crear la cuenta. Revisa los datos e intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  }

  let textoBoton = 'Registrarse';
  let iconoFlecha = <ArrowRight size={18} />;


  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 md:p-6 transition-colors">
      <div className="bg-white dark:bg-gray-900 max-w-md w-full rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8">

        {/* Icono y título */}
        <div className="text-center mb-8">
          <div className="bg-green-50 dark:bg-green-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100 dark:border-green-800/30">
            <UserPlus size={32} className="text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Crear Cuenta</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Únete a La Despensa de Lapa hoy mismo</p>
        </div>


        {/* Mostrar error*/}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm mb-6 border border-red-200">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={enviar} className="space-y-4">
          {/* Campo nombre y apellido */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre
              </label>
              <input
                type="text"
                placeholder="Juan"
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors outline-none text-gray-900 dark:text-gray-100"
                required
                value={datos.nombre}
                onChange={function (e) {
                  let nuevosDatos = Object.assign({}, datos);
                  nuevosDatos.nombre = e.target.value;
                  setDatos(nuevosDatos);
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Apellido
              </label>
              <input
                type="text"
                placeholder="Pérez"
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors outline-none text-gray-900 dark:text-gray-100"
                required
                value={datos.apellido}
                onChange={function (e) {
                  let nuevosDatos = Object.assign({}, datos);
                  nuevosDatos.apellido = e.target.value;
                  setDatos(nuevosDatos);
                }}
              />
            </div>
          </div>
          {/* Campo usuario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
              <User size={16} className="text-gray-400 dark:text-gray-600" /> Nombre de Usuario
            </label>
            <input
              type="text"
              placeholder="Ej: juanperez"
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors outline-none text-gray-900 dark:text-gray-100"
              required
              value={datos.usuario}
              onChange={function (e) {
                let nuevosDatos = Object.assign({}, datos);
                nuevosDatos.usuario = e.target.value;
                setDatos(nuevosDatos);
              }}
            />
          </div>

          {/* Campo correo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
              <Mail size={16} className="text-gray-400 dark:text-gray-600" /> Correo Electrónico
            </label>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors outline-none text-gray-900 dark:text-gray-100"
              required
              value={datos.correo}
              onChange={function (e) {
                let nuevosDatos = Object.assign({}, datos);
                nuevosDatos.correo = e.target.value;
                setDatos(nuevosDatos);
              }}
            />
          </div>

          {/* Campo contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
              <Lock size={16} className="text-gray-400 dark:text-gray-600" /> Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors outline-none text-gray-900 dark:text-gray-100"
              required
              value={datos.contraseña}
              onChange={function (e) {
                let nuevosDatos = Object.assign({}, datos);
                nuevosDatos.contraseña = e.target.value;
                setDatos(nuevosDatos);
              }}
            />
          </div>


          {/* Botón de envío */}
          <button
            type="submit"
            disabled={cargando}
            className="w-full mt-6 bg-green-600 text-white font-medium py-2 rounded-md flex items-center justify-center gap-2 hover:bg-green-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {textoBoton}
            {iconoFlecha}
          </button>
        </form>

        {/* Link a login */}
        <p className="text-center text-gray-500 mt-6 text-sm">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="text-green-600 font-medium hover:text-green-800 transition-colors">
            Inicia Sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Registro;
