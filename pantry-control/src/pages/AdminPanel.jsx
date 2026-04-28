import { useState, useEffect } from 'react';
import { Trash2, UserPlus, Shield, Mail, User } from 'lucide-react';
import { serviciosAPI } from '../services/api';

function AdminPanel() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Lapa estuvo aqui...
  const [nuevoUsuario, setNuevoUsuario] = useState({
    usuario: '',
    correo: '',
    contraseña: ''
  });

  // Cargar usuarios al montar el componente
  useEffect(function () {
    fetchUsuarios();
  }, []);

  async function fetchUsuarios() {
    try {
      const data = await serviciosAPI.obtenerUsuariosAdmin();
      setUsuarios(data);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar los usuarios. Verifica que eres administrador.');
    } finally {
      setCargando(false);
    }
  }

  async function agregarUsuario(e) {
    e.preventDefault();
    try {
      await serviciosAPI.registrarUsuario(nuevoUsuario);

      setNuevoUsuario({ usuario: '', correo: '', contraseña: '' });
      fetchUsuarios();
    } catch (err) {
      console.error(err);
      alert('Hubo un problema al crear el usuario.');
    }
  }

  async function eliminarUsuario(id) {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;

    try {
      await serviciosAPI.eliminarUsuarioAdmin(id);
      fetchUsuarios();
    } catch (err) {
      console.error(err);
      alert('Error al eliminar el usuario.');
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8 transition-colors">

      <div className="max-w-6xl mx-auto space-y-8">

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Shield className="text-green-600 dark:text-green-400" size={32} />
            Panel de Administración
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Gestiona los usuarios registrados en la plataforma.</p>
        </header>


        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Formulario para agregar lapa */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <UserPlus size={20} className="text-green-600 dark:text-green-400" />
                Añadir Usuario
              </h2>


              <form onSubmit={agregarUsuario} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nombre de usuario
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600" size={16} />
                    <input
                      type="text"
                      required
                      className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors text-gray-900 dark:text-gray-100"
                      placeholder="ej: juanperez"
                      value={nuevoUsuario.usuario}
                      onChange={function (e) { setNuevoUsuario({ ...nuevoUsuario, usuario: e.target.value }) }}
                    />
                  </div>

                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="email"
                      required
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                      placeholder="ej: juan@correo.com"
                      value={nuevoUsuario.correo}
                      onChange={function (e) { setNuevoUsuario({ ...nuevoUsuario, correo: e.target.value }) }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="password"
                      required
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                      placeholder="••••••••"
                      value={nuevoUsuario.contraseña}
                      onChange={function (e) { setNuevoUsuario({ ...nuevoUsuario, contraseña: e.target.value }) }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white font-medium py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Registrar Usuario
                </button>
              </form>
            </div>
          </div>

          {/* Tabla de usuarios */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Usuarios Registrados</h2>
              </div>


              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>

                    <tr className="bg-white border-b border-gray-200 text-sm text-gray-600 uppercase tracking-wider">
                      <th className="px-6 py-4 font-medium">ID</th>
                      <th className="px-6 py-4 font-medium">Usuario</th>
                      <th className="px-6 py-4 font-medium">Email</th>
                      <th className="px-6 py-4 font-medium">Rol</th>
                      <th className="px-6 py-4 font-medium text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {function () {
                      if (usuarios.length === 0) {
                        return (
                          <tr>
                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                              No hay usuarios registrados.
                            </td>
                          </tr>
                        );
                      }

                      return usuarios.map(function (usuario) {
                        let claseRol = "px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700";
                        let textoRol = "Usuario";

                        let tituloBoton = "Eliminar usuario";


                        if (usuario.esAdministrador) {
                          claseRol = "px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700";
                          textoRol = "Administrador";
                          tituloBoton = "No puedes eliminar a un administrador";
                        }

                        return (
                          <tr key={usuario.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">#{usuario.id}</td>
                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{usuario.usuario}</td>
                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{usuario.correo}</td>

                            <td className="px-6 py-4">
                              <span className={claseRol}>
                                {textoRol}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={function () { eliminarUsuario(usuario.id) }}
                                disabled={usuario.esAdministrador}
                                className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed p-2 rounded-md hover:bg-red-50"
                                title={tituloBoton}
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        );
                      });
                    }()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AdminPanel;

// mini consejo de Lapa los pies de melody de brawl star estan deliciosos!!