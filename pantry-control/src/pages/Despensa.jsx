import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Usamos 'as IconoInfinito' para evitar el error de ESLint por usar la palabra reservada 'Infinity'
import { Plus, Package, AlertCircle, Hash, Calendar, Infinity as IconoInfinito } from 'lucide-react';
import { serviciosAPI } from '../services/servicios';

// Importamos el componente desde la carpeta components
import TarjetaProducto from '../components/TarjetaProducto'; 

function Despensa() {
  const navegar = useNavigate();
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(false);

  // --- 1. LÓGICA DE DATOS ---

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

  // Usamos una función nombrada para el useEffect
  useEffect(function alMontar() {
    cargarDatos();
  },);

  // --- 2. ACCIONES ---

  function eliminar(id) {
    function filtrarLista() {
      // Función nombrada dentro del filter
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

  // --- 3. ORDENACIÓN ---

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
      <header className="flex items-center justify-between px-8 py-6 border-b bg-white shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-[#1f2937]">Mi Despensa</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-lg text-xs font-bold flex items-center gap-1">
              <Hash size={12} /> {productos.length}
            </span>
            <p className="text-sm text-gray-500 font-medium">
              {productos.length === 1 ? 'producto' : 'productos'}
            </p>
          </div>
        </div>

        <Link
          to="/añadir"
          className="bg-[#22c55e] hover:bg-[#16a34a] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold shadow-sm transition-transform active:scale-95"
        >
          <Plus size={18} />
          Añadir producto
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Alerta de error de conexión */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-center gap-2 mb-8">
            <AlertCircle size={18} />
            <span>Error al conectar con la base de datos</span>
          </div>
        )}

        {/* Contenedor normal) */}
        <div className="flex flex-wrap justify-center gap-8">
          {listaOrdenada.length > 0 ? (
            listaOrdenada.map(function renderizarTarjeta(p) {
              
              // Funciones nombradas para cada producto
              function irAEditar() { navegar('/editar/' + p.id); }
              function irABorrar() { eliminar(p.id); }

              return (
                <div key={p.id} className="relative pt-6">
                  {/* ICONO DE ESTADO FLOTANTE: Calendar o Infinito */}
                  <div className="absolute top-2 right-6 z-30 bg-white border-2 border-emerald-50 shadow-md rounded-full p-2">
                    {p.fechaCaducidad ? (
                      <Calendar size={18} className="text-orange-500" />
                    ) : (
                      <IconoInfinito size={18} className="text-blue-500" />
                    )}
                  </div>

                  {/* Wrapper con ancho fijo para que se vea como una rejilla pero con Flex */}
                  <div className="w-full sm:w-[340px]">
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
            /* Pantalla cuando no hay nada */
            !error && (
              <div className="w-full text-center py-20 text-gray-400">
                <Package size={48} className="mx-auto mb-3 opacity-20" />
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