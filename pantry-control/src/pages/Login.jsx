import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';
// import { serviciosAPI } from '../services/api';

// Página de login 
const Ingreso = () => {
  // Datos del formulario
  const [datos, setDatos] = useState({
    usuario: '',
    contraseña: ''
  });
  
  // Control de carga
  const [cargando, setCargando] = useState(false);
  // Mensaje de error
  const [error, setError] = useState(null);

  // Función para enviar el formulario
  const enviar = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError(null);
    
    try {
      // Llamada real al backend Spring cuando esté conectado
      // const respuesta = await serviciosAPI.iniciarSesion(datos);
      // localStorage.setItem('token', respuesta.token);
      
      console.log('Intentando login con:', datos);
      
      // Simulamos que el backend nos dio un token
      localStorage.setItem('token', 'fake-jwt-token-12345');
      
      // Redirigimos a la despensa
      window.location.href = '/despensa';
    } catch (err) {
      setError('Credenciales incorrectas o error en el servidor.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-xl border border-gray-100 p-8">
        {/* Icono y título */}
        <div className="text-center mb-8">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
            <Lock size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Bienvenido de nuevo</h2>
          <p className="text-gray-500 mt-2">Inicia sesión para gestionar tu despensa</p>
        </div>

        {/* Mostrar error si existe */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 text-center border border-red-100">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={enviar} className="space-y-5">
          {/* Campo usuario */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Nombre de usuario o Email" 
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 transition-all outline-none"
              required
              value={datos.usuario}
              onChange={(e) => setDatos({...datos, usuario: e.target.value})}
            />
          </div>

          {/* Campo contraseña */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="password" 
              placeholder="Contraseña" 
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 transition-all outline-none"
              required
              value={datos.contraseña}
              onChange={(e) => setDatos({...datos, contraseña: e.target.value})}
            />
          </div>

          {/* Botón de envío */}
          <button 
            type="submit" 
            disabled={cargando}
            className="w-full bg-green-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-green-700 transition-all shadow-lg shadow-green-100 disabled:opacity-70"
          >
            {cargando ? 'Iniciando...' : 'Iniciar Sesión'}
            {!cargando && <ArrowRight size={20} />}
          </button>
        </form>

        {/* Link a registro */}
        <p className="text-center text-gray-500 mt-8 text-sm">
          ¿No tienes una cuenta?{' '}
          <Link to="/registro" className="text-green-600 font-bold hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Ingreso;
