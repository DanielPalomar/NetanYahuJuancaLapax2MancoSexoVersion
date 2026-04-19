import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, Package, AlertTriangle, Search, Filter, ArrowUpDown } from 'lucide-react';

const Pantry = () => {
  // Estado para los productos (luego vendrán de la API)
  const [productos, setProductos] = useState([
    { id: 1, nombre: "Leche Entera", marca: "Pascual", caducidad: "2026-04-20", cantidad: 2, alerta: false },
    { id: 2, nombre: "Yogur Griego", marca: "Danone", caducidad: "2026-04-16", cantidad: 4, alerta: true },
    { id: 3, nombre: "Arroz", marca: "Sos", caducidad: "2027-12-01", cantidad: 1, alerta: false },
  ]);

  // Estados para filtrar y ordenar
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("caducidad"); // opciones: caducidad, nombre, cantidad

  // filtrado y ordenación
  const productosFiltrados = productos
    .filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a, b) => {
      if (orden === "caducidad") return new Date(a.caducidad) - new Date(b.caducidad);
      if (orden === "nombre") return a.nombre.localeCompare(b.nombre);
      if (orden === "cantidad") return b.cantidad - a.cantidad;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Cabecera y Botón Añadir */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Mi despensa</h2>
            <p className="text-gray-500">Gestiona y filtra tus existencias</p>
          </div>
          <Link to="/añadir" className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100 w-full md:w-auto justify-center">
            <Plus size={20} />
            <span>Añadir Producto</span>
          </Link>
        </div>

        {/* BARRA DE FILTROS (Expansible/Control) */}
        <div className="bg-white p-4 rounded-3xl shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center border border-gray-100">
          {/* Buscador */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Buscar producto..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 transition-all"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {/* Selector de Orden */}
          <div className="flex items-center gap-3 w-full md:w-auto bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100">
            <ArrowUpDown size={18} className="text-gray-400" />
            <select 
              className="bg-transparent border-none focus:ring-0 text-gray-600 font-medium cursor-pointer"
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
            >
              <option value="caducidad">Próximos a caducar</option>
              <option value="nombre">Orden alfabético</option>
              <option value="cantidad">Mayor cantidad</option>
            </select>
          </div>
        </div>

        {/* Lista de productos con Tailwind */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productosFiltrados.map((item) => (
  <div 
    key={item.id} 
    className={`
      group
      bg-white rounded-3xl p-6 border-l-8 transition-all duration-300 ease-out
      /* EFECTOS AL PASAR EL CURSOR (HOVER) */
      hover:-translate-y-2 hover:shadow-xl hover:shadow-gray-200/50 cursor-pointer
      ${item.alerta 
        ? 'border-orange-500 hover:border-orange-600 shadow-sm' 
        : 'border-green-500 hover:border-green-600 shadow-sm'}
    `}
  >
    {/* Icono y Alerta */}
    <div className="flex justify-between items-start mb-4">
      <div className="bg-gray-100 p-3 rounded-2xl text-gray-600 transition-colors group-hover:bg-green-100">
        <Package size={24} />
      </div>
      {item.alerta && (
        <span className="flex items-center gap-1 text-[10px] font-bold bg-orange-100 text-orange-600 px-2 py-1 rounded-full uppercase tracking-wider animate-pulse">
          <AlertTriangle size={12} /> Crítico
        </span>
      )}
    </div>

    {/* Textos */}
    <h3 className="text-xl font-bold text-gray-800 transition-colors hover:text-green-600">
      {item.nombre}
    </h3>
    <p className="text-gray-400 text-sm mb-4">{item.marca}</p>

    {/* Detalles con iconos */}
    <div className="space-y-3">
      <div className="flex items-center gap-3 text-gray-600 group">
        <Calendar size={18} className="text-gray-400 group-hover:text-green-500 transition-colors" />
        <span className="text-sm">Caduca: <strong className={item.alerta ? 'text-orange-600' : 'text-gray-800'}>{item.caducidad}</strong></span>
      </div>
      <div className="flex items-center gap-3 text-gray-600">
        <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600 font-bold text-sm transition-transform hover:scale-110">
          {item.cantidad}
        </div>
        <span className="text-sm font-medium">Unidades</span>
      </div>
    </div>

    {/* Botones de acción rápidos que aparecen/resaltan */}
    <div className="mt-6 pt-4 border-t border-gray-50 flex gap-4">
      <button className="text-xs font-bold text-gray-400 hover:text-green-600 uppercase tracking-widest transition-colors">
        Editar
      </button>
      <button className="text-xs font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors">
        Eliminar
      </button>
    </div>
  </div>
))}
        </div>
        
        {/* Mensaje si no hay resultados */}
        {productosFiltrados.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No se han encontrado productos con ese nombre.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pantry;