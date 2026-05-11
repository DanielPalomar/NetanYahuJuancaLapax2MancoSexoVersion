import { Pencil, Trash2, Store } from 'lucide-react';

function TarjetaProducto(props) {
  // 1. Escudo de seguridad: si no hay producto, no renderizamos nada
  if (!props.producto) return null;

  const p = props.producto;

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col justify-between relative">
      
      <div>
        {/* Cabecera: Súper y Cantidad */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-1.5 text-[#22c55e] bg-emerald-50 px-2 py-1 rounded-md">
            <Store size={14} />
            <span className="text-xs font-bold uppercase tracking-wider">
              {p.supermercado || 'General'}
            </span>
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-gray-400 uppercase">Cant.</span>
            <span className="text-xl font-black text-emerald-600 leading-none">
              {p.cantidad || 1}
            </span>
          </div>
        </div>

        {/* Nombre y Fecha */}
        <h3 className="text-xl font-bold text-gray-800 mb-1 capitalize">
          {p.nombre || 'Producto'}
        </h3>
        <p className="text-sm text-gray-500 font-medium italic">
          {p.fechaCaducidad || 'Sin fecha'}
        </p>
      </div>

      {/* Botones: Asegúrate de que NO haya ningún <Link> o <a> envolviendo esto */}
      <div className="flex justify-between mt-6 pt-4 border-t border-gray-50">
        <button
          type="button"
          onClick={props.alEditar}
          className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-bold text-sm"
        >
          <Pencil size={16} /> Editar
        </button>

        <button
          type="button"
          onClick={props.alEliminar}
          className="flex items-center gap-1.5 text-red-500 hover:text-red-600 font-bold text-sm"
        >
          <Trash2 size={16} /> Eliminar
        </button>
      </div>
    </div>
  );
}

export default TarjetaProducto;