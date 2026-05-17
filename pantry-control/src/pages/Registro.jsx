import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { serviciosAPI } from "../services/servicios";

function Registro() {
  // Para que cuando se termine de registrar nos mande al login
  let navegar = useNavigate();

  // Estados para guardar los datos del formulario
  let [nombre, setNombre] = useState("");
  let [apellido, setApellido] = useState("");
  let [usuario, setUsuario] = useState("");
  let [correo, setCorreo] = useState("");
  let [contraseña, setContraseña] = useState("");
  let [error, setError] = useState(null);

  // to esto para actualizar cada campo 
  function cambiarNombre(e) {
    setNombre(e.target.value);
  }
  function cambiarApellido(e) {
    setApellido(e.target.value);
  }
  function cambiarUsuario(e) {
    setUsuario(e.target.value);
  }
  function cambiarCorreo(e) {
    setCorreo(e.target.value);
  }
  function cambiarContraseña(e) {
    setContraseña(e.target.value);
  }


  // Función que se ejecuta al enviar el formulario
  function enviar(e) {
    e.preventDefault();
    serviciosAPI
      .registrarUsuario({
        nombre: nombre,
        apellido: apellido,
        usuario: usuario,
        correo: correo,
        contraseña: contraseña,
      })
      .then(function () {
        // Si todo sale bien, vamos al login
        navegar("/login");
      })
      .catch(function () {
        // Si hay error, mostramos mensaje
        setError("Error al crear la cuenta");
      });
  }

  return (

    <div className="relative flex items-center justify-center min-h-screen px-4 py-8 overflow-hidden">
      {/* Fondo con imagen y desenfoque */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url("https://static.vecteezy.com/system/resources/previews/009/706/107/non_2x/top-view-of-healthy-food-background-with-copy-space-healthy-food-concept-with-fresh-vegetables-photo.jpg")',
          filter: 'blur(10px)',
          transform: 'scale(1.1)'
        }}
      />

      {/* Tarjeta blanca principal */}
      <div className="relative z-20 w-full max-w-md bg-white p-10 rounded-sm border border-emerald-100">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-emerald-950 mb-2 tracking-tight">
            Crear cuenta
          </h2>
          <p className="text-emerald-600/80">Únete a la mejor despensa</p>
        </div>

        {/* Alerta de error */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-sm mb-6 text-sm border border-red-100 text-center">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={enviar} className="space-y-4">
          {/*Nombre y Apellido */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-emerald-900 mb-2">
                Nombre
              </label>
              <input
                type="text"
                required
                placeholder="Mario"
                className="w-full px-4 py-3 bg-slate-50 border border-emerald-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                value={nombre}
                onChange={cambiarNombre}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-emerald-900 mb-2">
                Apellido
              </label>
              <input
                type="text"
                required
                placeholder="Marugan"
                className="w-full px-4 py-3 bg-slate-50 border border-emerald-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                value={apellido}
                onChange={cambiarApellido}
              />
            </div>
          </div>

          {/* Usuario */}
          <div>
            <label className="block text-sm font-medium text-emerald-900 mb-2">
              Usuario
            </label>
            <input
              type="text"
              required
              placeholder="mariomarugan"
              className="w-full px-4 py-3 bg-slate-50 border border-emerald-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
              value={usuario}
              onChange={cambiarUsuario}
            />
          </div>

          {/* Correo */}
          <div>
            <label className="block text-sm font-medium text-emerald-900 mb-2">
              Correo
            </label>
            <input
              type="email"
              required
              placeholder="correo@ejemplo.com"
              className="w-full px-4 py-3 bg-slate-50 border border-emerald-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
              value={correo}
              onChange={cambiarCorreo}
            />
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium text-emerald-900 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-50 border border-emerald-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
              value={contraseña}
              onChange={cambiarContraseña}
            />
          </div>


          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-sm transition-colors mt-2"
          >
            Crear cuenta
          </button>
        </form>

        {/* volver si ya tienes cuenta */}
        <p className="text-center text-emerald-600/80 mt-8">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="text-emerald-700 font-semibold hover:text-emerald-800 hover:underline transition-colors"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Registro;
