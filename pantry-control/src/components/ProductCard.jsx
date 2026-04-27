import { Edit2, Trash2, Calendar } from 'lucide-react';

// TARJETA DE PRODUCTO by Lapa
function ProductCard({ producto, alEditar, alEliminar }) {


  const stockColor = producto.cantidad < 3 ? "text-red-500" : "text-gray-400";

  return (
    <div className="group bg-white dark:bg-transparent pb-8 border-b border-gray-50 dark:border-gray-800 transition-all">

      {/* Información principal */}
      <div className="space-y-1 mb-4">
        <h3 className="text-2xl font-light text-gray-900 dark:text-gray-100 leading-tight tracking-tight group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">
          {producto.nombre || "Sin nombre"}
        </h3>
        <p className="text-sm text-gray-400 dark:text-gray-500 font-medium tracking-wide">
          {producto.marca || "Marca genérica"}
        </p>
      </div>

      {/* Detalles sutiles */}
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <div className={`text-sm font-bold ${stockColor}`}>
            {producto.cantidad} unidades disponibles
          </div>
          {producto.fechaCaducidad && (
            <div className="flex items-center gap-2 text-xs text-gray-300 dark:text-gray-600">
              <Calendar size={14} />
              <span>Expira: {producto.fechaCaducidad}</span>
            </div>
          )}
        </div>

        {/* Acciones pasar raton, viva netanyahu */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={alEditar}
            className="p-2 text-gray-300 dark:text-gray-600 hover:text-black dark:hover:text-white transition-colors"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={alEliminar}
            className="p-2 text-gray-300 dark:text-gray-600 hover:text-red-500 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
