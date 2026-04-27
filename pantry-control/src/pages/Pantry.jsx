import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Loader2, PackageOpen } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { serviciosAPI } from '../services/api';

// MI DESPENSA
function Despensa() {
  const navegar = useNavigate();
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");


  //Carga de datos
  async function cargar() {
    setCargando(true);
    try {
      const datos = await serviciosAPI.obtenerDespensa();
      setProductos(Array.isArray(datos) ? datos : []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  //Manejo de eliminación sencillo
  const manejarEliminar = async (id) => {
    if (!window.confirm("¿Quitar este producto?")) return;
    try {
      await serviciosAPI.eliminarProducto(id);
      setProductos(productos.filter(p => p.id !== id));
    } catch (err) {
      alert("No se pudo eliminar.");
    }
  };

  // Filtrado de búsqueda
  const filtrados = productos.filter(p =>
    (p.nombre || "").toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-24 transition-colors">



      {/* Cabecera*/}
      <div className="max-w-5xl mx-auto px-6 pt-20 pb-12">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-light tracking-tight dark:text-white">Mi Despensa</h1>
            <p className="text-gray-400 dark:text-gray-500 mt-3 text-lg">Tienes {productos.length} artículos guardados.</p>
          </div>
          <Link
            to="/añadir"
            className="bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2"
          >

            <Plus size={20} /> Añadir
          </Link>
        </div>
      </div>

      {/* Buscador*/}
      <div className="max-w-5xl mx-auto px-6 mb-16">
        <div className="relative">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-700" size={24} />
          <input
            type="text"
            placeholder="¿Qué estás buscando?"
            className="w-full pl-10 py-4 bg-transparent border-b border-gray-100 dark:border-gray-800 focus:border-black dark:focus:border-white outline-none transition-all text-xl font-light placeholder:text-gray-200 dark:placeholder:text-gray-800"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        {cargando ? (
          <div className="flex flex-col items-center py-20">
            <Loader2 className="animate-spin text-gray-200" size={40} />
          </div>
        ) : (
          <>
            {filtrados.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                {filtrados.map(p => (
                  <ProductCard
                    key={p.id}
                    producto={p}
                    alEditar={() => navegar(`/editar/${p.id}`)}
                    alEliminar={() => manejarEliminar(p.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-32">
                <PackageOpen size={64} className="mx-auto text-gray-100 dark:text-gray-800 mb-6" />
                <p className="text-gray-400 dark:text-gray-600 text-xl font-light">Tu despensa está lista para ser llenada.</p>
                <Link to="/añadir" className="text-black dark:text-white font-bold mt-4 inline-block border-b-2 border-black dark:border-white pb-1">Empieza ahora</Link>
              </div>

            )}
          </>
        )}
      </div>
    </div>
  );
}
//Toma cari esto es para ti ♥ 
export default Despensa;