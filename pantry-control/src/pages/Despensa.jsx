import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Package, AlertCircle, Hash, Calendar } from 'lucide-react';
import { serviciosAPI } from '../services/servicios';
import TarjetaProducto from '../components/TarjetaProducto';

function Despensa() {
  const navegar = useNavigate();
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(false);

  // LÓGICA DE DATITOS

  function actualizarEstado(datos) {
    if (datos) {
      setProductos(datos);
    }
  }

  function manejarError() {
    setError(true);
  }

  function cargarDatos() {
    serviciosAPI.obtenerDespensa()
      .then(actualizarEstado)
      .catch(manejarError);
  }

  //PARA CARGAR LO DATO
  useEffect(function alMontar() {
    cargarDatos();
  }, []);

  // ACCIONES 

  function eliminar(id) {
    function filtrarLista() {
      const nuevaLista = productos.filter(function coincideId(p) {
        return p.id !== id;
      });
      setProductos(nuevaLista);
    }

    serviciosAPI.eliminarProducto(id)
      .then(filtrarLista)
      .catch(function errorBorrado() {
        alert("No se pudo eliminar el producto");
      });
  }

  //ORDENADURA

  function compararFechas(a, b) {
    // Si no hay fecha de caducidad, lo mandamos al final
    if (!a.fechaCaducidad) return 1;
    if (!b.fechaCaducidad) return -1;
    return new Date(a.fechaCaducidad) - new Date(b.fechaCaducidad);
  }

  const listaOrdenada = [...productos].sort(compararFechas);

  return (
    <div className="min-h-screen bg-[#f6f9f7]">

      {/* CABECERA */}
      <header className="relative flex items-center justify-between px-4 sm:px-8 py-6 border-b bg-white shadow-sm min-h-[100px] overflow-hidden">

        {/*esto es basicamente como un hueco en medio para que el titulo quede en el medions*/}
        <div className="hidden sm:block flex-1"></div>

        {/* Cabecera */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none w-full px-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1f2937] text-center">Mi Despensa</h1>
          <div className="flex items-center justify-center gap-2 mt-1 pointer-events-auto">
            <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-lg text-xs font-bold flex items-center gap-1">
              <Hash size={12} /> {productos.length}
            </span>
            <p className="text-sm text-gray-500 font-medium">
              {productos.length === 1 ? 'producto' : 'productos'}
            </p>
          </div>
        </div>

        {/* Botón Añadir */}
        <div className="flex-1 flex justify-end z-10 relative">
          <Link
            to="/añadir"
            className="bg-[#22c55e] hover:bg-[#16a34a] text-white px-3 sm:px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold shadow-sm transition-transform active:scale-95 text-sm sm:text-base whitespace-nowrap"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Añadir producto</span>
            <span className="sm:hidden">Añadir</span>
          </Link>
        </div>
      </header>

      <main className="w-full flex flex-col items-center px-4 sm:px-8 py-12">
        {/* Alerta de error de conexión */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-center gap-2 mb-8">
            <AlertCircle size={18} />
            <span>Error al conectar con la base de datos</span>
          </div>
        )}

        {/* Contenedor normal */}
        <div className="flex flex-row flex-wrap justify-center items-center w-full gap-6 sm:gap-8">
          {listaOrdenada.length > 0 ? (
            listaOrdenada.map(function renderizarTarjeta(p) {

              // funciones para cada producto
              function irAEditar() { navegar('/editar/' + p.id); }
              function irABorrar() { eliminar(p.id); }

              return (
                <div key={p.id} className="relative pt-6 w-[340px] max-w-[90vw] flex-shrink-0">
                  {/*icono flotante cool */}
                  {p.fechaCaducidad && (
                    <div className="absolute top-2 right-2 z-30 bg-white border-2 border-emerald-50 shadow-md rounded-full p-2">
                      <Calendar size={18} className="text-orange-500" />
                    </div>
                  )}

                  <div className="w-full h-full">
                    <TarjetaProducto
                      producto={p}
                      alEditar={irAEditar}
                      alEliminar={irABorrar}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            /* Pantalla cuando no hay nadita */
            !error && (
              <div className="w-full text-center py-20 text-gray-400 flex flex-col items-center justify-center">
                <Package size={48} className="mb-3 opacity-20" />
                <p className="text-lg">Tu despensa está vacía</p>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}

export default Despensa;