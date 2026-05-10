import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, Package } from 'lucide-react';
import TarjetaProducto from '../components/TarjetaProducto';
import { serviciosAPI } from '../services/servicios';

function Despensa() {
  let navegar = useNavigate();
  let [productos, setProductos] = useState([]);
  let [busqueda, setBusqueda] = useState("");

  useEffect(function () {
    serviciosAPI.obtenerDespensa().then(function (datos) {
      if (datos) setProductos(datos);
    }).catch(function () {
      console.log('error al cargar las cosillas');
    });
  }, []);

  function manejarEliminar(id) {
    if (!window.confirm("¿Eliminar este producto?")) return;
    serviciosAPI.eliminarProducto(id).then(function () {
      let lista = productos.filter(p => p.id !== id);
      setProductos(lista);
    }).catch(function () {
      alert("Error al eliminar");
    });
  }

  function cambiarBusqueda(e) {
    setBusqueda(e.target.value);
  }

  // --- LÓGICA DE FILTRADO ---
  let filtrados = productos.filter(prod => {
    let nom = prod.nombre ? prod.nombre.toLowerCase() : '';
    return nom.includes(busqueda.toLowerCase());
  });

  // LÓGICA DE ORDENACIÓN (el mas cerca a cadaucar primero)
  filtrados.sort(function (a, b) {
    if (!a.fechaCaducidad && !b.fechaCaducidad) return 0;
    if (!a.fechaCaducidad) return 1;
    if (!b.fechaCaducidad) return -1;
    return new Date(a.fechaCaducidad) - new Date(b.fechaCaducidad);
  });

  return (
    <div className="min-h-screen bg-emerald-50 pb-24">

      {/* CABECERA CENTRADA */}
      <div className="bg-white border-b border-emerald-100 shadow-sm py-12 mb-12 w-full flex justify-center">
        <div className="w-full max-w-6xl px-6 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-emerald-950 mb-4 tracking-tight w-full">
            Mi Despensa
          </h1>
          <p className="text-emerald-700/80 text-xl mb-10 w-full">
            Gestiona tus alimentos y evita el desperdicio
          </p>

          <Link
            to="/añadir"
            className="inline-flex items-center gap-3 bg-emerald-600 text-white py-4 px-12 rounded-2xl font-bold text-xl hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200"
          >
            <Plus size={26} strokeWidth={3} />
            Añadir Producto
          </Link>
        </div>
      </div>

      {/* CUERPO PRINCIPAL*/}
      <div className="max-w-6xl mx-auto px-6 md:px-8">

        {/* BUSCADOR*/}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-400 group-focus-within:text-emerald-700 transition-colors" size={24} />
            <input
              type="text"
              placeholder="Buscar ingredientes..."
              className="w-full pl-16 pr-8 py-5 bg-white border border-emerald-200 rounded-[2.5rem] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors shadow-sm text-xl"
              value={busqueda}
              onChange={cambiarBusqueda}
            />
          </div>
          <div className="text-center mt-6 text-emerald-600 font-bold uppercase tracking-widest text-xs">
            Tienes {filtrados.length} artículos en la lista
          </div>
        </div>

        {/* LISTADO DE PRODUCTOS */}
        {filtrados.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filtrados.map(p => (
              <TarjetaProducto
                key={p.id}
                producto={p}
                alEditar={() => navegar('/editar/' + p.id)}
                alEliminar={() => manejarEliminar(p.id)}
              />
            ))}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto text-center py-24 bg-white border border-dashed border-emerald-200 rounded-[3rem] shadow-sm">
            <Package className="mx-auto text-emerald-300 mb-6" size={80} />
            <h3 className="text-2xl font-bold text-emerald-900 mb-3">¿Vaciando la cocina?</h3>
            <p className="text-emerald-700/80 text-lg">No hay productos que coincidan con tu búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Despensa;