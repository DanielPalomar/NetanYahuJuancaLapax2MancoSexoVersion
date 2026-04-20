import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, ArrowRight } from 'lucide-react';
// import { serviciosAPI } from '../services/api';

// Página de registro simple - donde te registras por primera vez
const Registro = () => {
  const navegar = useNavigate();
  
  // Datos del formulario
  const [datos, setDatos] = useState({
    usuario: '',
    correo: '',
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
      // Aquí iría la llamada real al backend Spring
      // await serviciosAPI.registrarUsuario(datos);
      
      console.log('Registrando con:', datos);
      
      // Redirigimos a login después del registro
      navegar('/login');
    } catch (err) {
      setError('Hubo un error al crear la cuenta. Inténtalo de nuevo.');
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
            <UserPlus size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Crear Cuenta</h2>
          <p className="text-gray-500 mt-2">Únete a PantryControl hoy mismo</p>
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
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Nombre de Usuario" 
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 transition-all outline-none"
              required
              value={datos.usuario}
              onChange={(e) => setDatos({...datos, usuario: e.target.value})}
            />
          </div>

          {/* Campo correo */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="email" 
              placeholder="Correo Electrónico" 
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 transition-all outline-none"
              required
              value={datos.correo}
              onChange={(e) => setDatos({...datos, correo: e.target.value})}
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
            {cargando ? 'Registrando...' : 'Registrarse'}
            {!cargando && <ArrowRight size={20} />}
          </button>
        </form>

        {/* Link a login */}
        <p className="text-center text-gray-500 mt-8 text-sm">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="text-green-600 font-bold hover:underline">
            Inicia Sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Registro;
