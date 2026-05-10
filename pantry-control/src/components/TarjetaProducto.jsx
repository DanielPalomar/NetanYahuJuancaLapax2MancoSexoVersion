function TarjetaProducto(props) {
  let { producto, alEditar, alEliminar } = props;
  let esVencido = producto.fechaCaducidad && new Date(producto.fechaCaducidad) < new Date();

  return (
    <div className={`p-6 border rounded-2xl transition-all shadow-sm hover:shadow-md ${esVencido ? 'bg-emerald-50/50 border-emerald-100 opacity-70' : 'bg-white border-emerald-100 hover:-translate-y-1 hover:border-emerald-200'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="pr-4">
          {producto.marca && <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600/70 mb-1.5">{producto.marca}</p>}
          <h3 className={`text-xl font-bold leading-tight ${esVencido ? 'line-through text-emerald-600/60' : 'text-emerald-950'}`}>
            {producto.nombre}
          </h3>
        </div>
        <span className="bg-emerald-600 text-white px-3 py-1.5 text-sm font-bold rounded-xl shadow-sm">{producto.cantidad}</span>
      </div>
      <div className="border-t border-emerald-50 pt-4 flex justify-between items-center mt-2">
        <span className={`text-sm font-medium ${esVencido ? 'text-red-500 line-through' : 'text-emerald-700/80'}`}>
          {producto.fechaCaducidad ? `Vence: ${producto.fechaCaducidad}` : 'Sin fecha'}
        </span>
        <div className="flex gap-3">
          <button onClick={alEditar} className="text-emerald-700 font-semibold hover:text-emerald-900 transition-colors text-sm bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100">Editar</button>
          <button onClick={alEliminar} className="text-red-500 font-semibold hover:text-white transition-colors text-sm hover:bg-red-500 px-3 py-1.5 rounded-lg">Eliminar</button>
        </div>
      </div>
    </div>
  );
}

export default TarjetaProducto;
