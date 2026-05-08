import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, Package } from 'lucide-react';
import TarjetaProducto from '../components/TarjetaProducto';
import { serviciosAPI } from '../services/servicios';

/**
 * PÁGINA DE DESPENSA "CRAFT" 
 */
function Despensa() {
  let navegar = useNavigate();
  let [productos, setProductos] = useState([]);
  let [busqueda, setBusqueda] = useState("");

  useEffect(function() {
    serviciosAPI.obtenerDespensa().then(function(datos) {
      if (datos) setProductos(datos);
    }).catch(function() {
      console.log('error');
    });
  }, []);

  function manejarEliminar(id) {
    if (!window.confirm("¿Eliminar?")) return;
    serviciosAPI.eliminarProducto(id).then(function() {
      let lista = [];
      for (let i = 0; i < productos.length; i++) {
        if (productos[i].id !== id) lista.push(productos[i]);
      }
      setProductos(lista);
    }).catch(function() {
      alert("Error");
    });
  }

  function cambiarBusqueda(e) {
    setBusqueda(e.target.value);
  }

  let filtrados = [];
  for (let i = 0; i < productos.length; i++) {
    let prod = productos[i];
    let nom = prod.nombre ? prod.nombre.toLowerCase() : '';
    let bus = busqueda.toLowerCase();
    if (nom.includes(bus)) filtrados.push(prod);
  }

  filtrados.sort(function(a, b) {
    if (!a.fechaCaducidad && !b.fechaCaducidad) return 0;
    if (!a.fechaCaducidad) return 1;
    if (!b.fechaCaducidad) return -1;
    let dateA = new Date(a.fechaCaducidad);
    let dateB = new Date(b.fechaCaducidad);
    if (dateA < dateB) return -1;
    if (dateA > dateB) return 1;
    return 0;
  });

  let tarjetas = [];
  for (let i = 0; i < filtrados.length; i++) {
    let p = filtrados[i];
    let pid = p.id;
    tarjetas.push(
      <TarjetaProducto
        key={p.id}
        producto={p}
        alEditar={function() { navegar('/editar/' + pid); }}
        alEliminar={function() { manejarEliminar(pid); }}
      />
    );
  }

  let contenidoPrincipal = null;
  if (tarjetas.length > 0) {
    contenidoPrincipal = (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tarjetas}
      </div>
    );
  } else {
    contenidoPrincipal = (
      <div className="text-center py-16 bg-white border border-blue-200 rounded">
        <p className="text-slate-500">Sin productos</p>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="py-6 mb-6 bg-blue-50 border-b border-blue-200">
        <div className="max-w  mx-auto px-8 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-4xl font-bold text-blue-900">Mis Productos</h1>
            <p className="text-slate-700 text-sm mt-1">Aprovecha todo lo que tengas</p>
          </div>
          <Link to="/añadir" className="bg-blue-600 text-white py-2 px-6 font-semibold rounded hover:bg-blue-700">
            añadir un nuevo articulo
          </Link>
        </div>
      </div>

      <div className="max-w mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
          <input
            type="text"
            placeholder="Buscar ingredientes..."
            className="flex-1 px-4 py-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
            value={busqueda}
            onChange={cambiarBusqueda}
          />
          <div className="text-sm text-slate-600">
            {productos.length} productos
          </div>
        </div>
        {contenidoPrincipal}
      </div>
    </div>
  );
}

export default Despensa;
