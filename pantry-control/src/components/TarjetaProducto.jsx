import { Pencil, Trash2 } from 'lucide-react';

// Este componente sirve para mostrar la cajita de cada producto
function TarjetaProducto(props) {

  // Primero revisamos si el producto existe
  // Si no existe, no dibujamos nada en la pantalla
  if (props.producto == null) {
    return null;
  }

  // Guardamos el producto en una variable para escribir menos luego
  let producto = props.producto;

  return (
    <div className="bg-white border border-emerald-100 rounded-sm p-5 flex flex-col justify-between h-full">

      {/* Contenedor de la información de arriba */}
      <div>
        {/* Aquí mostramos la cantidad del producto a la derecha */}
        <div className="flex justify-end items-start mb-4">
          <div className="text-slate-500 text-xs font-bold bg-slate-100 px-2 py-0.5 rounded-sm">
            Cantidad: {producto.cantidad}
          </div>
        </div>

        {/* nombre con primera letra en mayúscula */}
        <h3 className="text-xl font-bold text-slate-800 mb-0.5 capitalize">
          {producto.nombre}
        </h3>

        {/* Mostramos marca   */}
        <p className="text-xs text-slate-400 font-bold uppercase mb-2">
          {producto.marca}
        </p>

        {/* La fecha en la que caduca el producto  en caso de no caducar se muestra un texto predefinido*/}
        <p className="text-sm text-slate-500 font-medium">
          Caduca el: <span className="text-slate-700 font-semibold">{producto.fechaCaducidad || 'Sin fecha'}</span>
        </p>
      </div>

      {/* Los botones de acción que están abajo del todo */}
      <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">

        {/* Botón para abrir el formulario de edición */}
        <button
          type="button"
          onClick={props.alEditar}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-sm transition-colors"
        >
          <Pencil size={16} /> Editar
        </button>

        {/* Botón para borrar el producto de la lista */}
        <button
          type="button"
          onClick={props.alEliminar}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-sm transition-colors"
        >
          <Trash2 size={16} /> Borrar
        </button>
      </div>
    </div>
  );
}

export default TarjetaProducto;