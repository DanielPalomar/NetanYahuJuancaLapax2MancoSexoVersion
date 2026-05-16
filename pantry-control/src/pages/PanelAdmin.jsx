import { useState, useEffect } from 'react';
import { Trash2, UserPlus, Shield } from 'lucide-react';
import { serviciosAPI } from '../services/servicios';

function PanelAdmin() {
  let [usuarios, setUsuarios] = useState([]);
  let usuarioLogueado = localStorage.getItem('username');
  let [nuevoNombre, setNuevoNombre] = useState('');
  let [nuevoApellido, setNuevoApellido] = useState('');
  let [nuevoUsuario, setNuevoUsuario] = useState('');
  let [nuevoCorreo, setNuevoCorreo] = useState('');
  let [nuevaContraseña, setNuevaContraseña] = useState('');
  let [nuevoEsAdmin, setNuevoEsAdmin] = useState(false);

  useEffect(() => {
    serviciosAPI.obtenerUsuariosAdmin()
      .then((data) => {
        setUsuarios(data || []);
      })
      .catch((err) => {
        console.error("Error al obtener usuarios administradores:", err);
      });
  }, []);

  function agregarUsuario(e) {
    e.preventDefault();
    serviciosAPI.registrarUsuario({
      nombre: nuevoNombre,
      apellido: nuevoApellido,
      usuario: nuevoUsuario,
      correo: nuevoCorreo,
      contraseña: nuevaContraseña,
      admin: nuevoEsAdmin
    }).then(function () {
      setNuevoNombre('');
      setNuevoApellido('');
      setNuevoUsuario('');
      setNuevoCorreo('');
      setNuevaContraseña('');
      setNuevoEsAdmin(false);
      serviciosAPI.obtenerUsuariosAdmin().then(function (data) {
        setUsuarios(data || []);
      }).catch(function () {
        console.log('error');
      });
    }).catch(function () {
      alert('Error');
    });
  }

  function eliminarUsuario(id) {
    if (!window.confirm('¿Eliminar?')) return;
    serviciosAPI.eliminarUsuarioAdmin(id).then(function () {
      serviciosAPI.obtenerUsuariosAdmin().then(function (data) {
        setUsuarios(data || []);
      }).catch(function () {
        console.log('error');
      });
    }).catch(function () {
      alert('Error');
    });
  }

  function toggleActivo(id) {
    serviciosAPI.activarUsuarioAdmin(id).then(function () {
      serviciosAPI.obtenerUsuariosAdmin().then(function (data) {
        setUsuarios(data || []);
      }).catch(function () {
        console.log('error');
      });
    }).catch(function () {
      alert('Error al cambiar estado');
    });
  }


  // FILAS DE LA TABLANS
  let filasTabla = [];
  for (let i = 0; i < usuarios.length; i++) {
    let u = usuarios[i];
    let claseRol = 'px-2 py-1 text-xs font-bold bg-slate-200 text-slate-800 rounded';
    let textoRol = 'User';
    if (u.esAdministrador) {
      claseRol = 'px-2 py-1 text-xs font-bold bg-emerald-200 text-emerald-800 rounded';
      textoRol = 'Admin';
    }
    filasTabla.push(
      <tr key={u.id} className="border-b border-emerald-200 hover:bg-emerald-50">
        <td className="px-4 py-3 font-semibold text-slate-800">{u.usuario}</td>
        <td className="px-4 py-3 text-slate-600">{u.correo}</td>
        <td className="px-4 py-3"><span className={claseRol}>{textoRol}</span></td>
        <td className="px-4 py-3">
          <button
            onClick={function (userId) { return function () { toggleActivo(userId); }; }(u.id)}
            disabled={u.usuario === usuarioLogueado}
            className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
              u.estaActivo 
                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' 
                : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
            } disabled:opacity-30 disabled:cursor-not-allowed`}
          >
            {u.estaActivo ? 'Desactivar' : 'Activar'}
          </button>
        </td>
        <td className="px-4 py-3 text-right">
          <button
            onClick={function (userId) { return function () { eliminarUsuario(userId); }; }(u.id)}
            disabled={u.esAdministrador}
            className="text-red-600 hover:text-red-800 font-semibold disabled:opacity-50"
          >
            Eliminar
          </button>
        </td>
      </tr>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f9f7] p-6 pb-24">
      <div className="max-w mx-auto">

        <div className="bg-white p-6 border border-emerald-200 rounded mb-6">
          <h1 className="text-3xl font-bold text-emerald-900 mb-2">Panel de Administración</h1>
          <p className="text-slate-700">Total de usuarios: {usuarios.length}</p>
        </div>

        {/* para organizar los elementos */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Contenedor del Formulario */}
          <div className="flex-1 bg-white p-6 border border-emerald-200 rounded self-start">
            <h2 className="text-xl font-bold text-emerald-900 mb-4">Nuevo Usuario</h2>
            <form onSubmit={agregarUsuario} className="space-y-3">
              <input type="text" required placeholder="Nombre" className="w-full px-3 py-2 border border-emerald-200 rounded focus:outline-none focus:border-emerald-500" value={nuevoNombre} onChange={function (e) { setNuevoNombre(e.target.value); }} />
              <input type="text" required placeholder="Apellido" className="w-full px-3 py-2 border border-emerald-200 rounded focus:outline-none focus:border-emerald-500" value={nuevoApellido} onChange={function (e) { setNuevoApellido(e.target.value); }} />
              <input type="text" required placeholder="Usuario" className="w-full px-3 py-2 border border-emerald-200 rounded focus:outline-none focus:border-emerald-500" value={nuevoUsuario} onChange={function (e) { setNuevoUsuario(e.target.value); }} />
              <input type="email" required placeholder="Correo" className="w-full px-3 py-2 border border-emerald-200 rounded focus:outline-none focus:border-emerald-500" value={nuevoCorreo} onChange={function (e) { setNuevoCorreo(e.target.value); }} />
              <input type="password" required placeholder="Contraseña" className="w-full px-3 py-2 border border-emerald-200 rounded focus:outline-none focus:border-emerald-500" value={nuevaContraseña} onChange={function (e) { setNuevaContraseña(e.target.value); }} />
              <div className="flex items-center gap-2 p-3 border border-emerald-200 rounded">
                <input type="checkbox" id="isAdmin" className="w-4 h-4 cursor-pointer" checked={nuevoEsAdmin} onChange={function (e) { setNuevoEsAdmin(e.target.checked); }} />
                <label htmlFor="isAdmin" className="text-sm font-semibold text-slate-700 cursor-pointer">Admin</label>
              </div>
              <button type="submit" className="w-full bg-[#22c55e] text-white font-semibold py-2 rounded hover:bg-[#16a34a]">Crear</button>
            </form>
          </div>

          {/* contenedor de la fakin tabla*/}
          <div className="flex-[2] bg-white border border-emerald-200 rounded overflow-hidden">
            <div className="px-4 py-3 border-b border-emerald-200 bg-emerald-50">
              <h2 className="font-bold text-emerald-900">Usuarios</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs font-bold text-slate-700 border-b border-emerald-200 bg-emerald-50">
                    <th className="px-4 py-2">Usuario</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Rol</th>
                    <th className="px-4 py-2">Estado</th>
                    <th className="px-4 py-2 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filasTabla}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default PanelAdmin;