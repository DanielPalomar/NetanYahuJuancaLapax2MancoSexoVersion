function TarjetaProducto(props) {
  let { producto, alEditar, alEliminar } = props;
  let esVencido = producto.fechaCaducidad && new Date(producto.fechaCaducidad) < new Date();

  return (
    <div className={`p-4 border rounded-lg ${esVencido ? 'bg-slate-100 border-slate-300 opacity-60' : 'bg-white border-blue-200'}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          {producto.marca && <p className="text-xs text-slate-500 mb-1">{producto.marca}</p>}
          <h3 className={`font-bold ${esVencido ? 'line-through text-slate-500' : 'text-slate-800'}`}>
            {producto.nombre}
          </h3>
        </div>
        <span className="bg-blue-600 text-white px-2 py-1 text-xs font-bold rounded">{producto.cantidad}</span>
      </div>
      <div className="border-t border-blue-100 pt-3 flex justify-between items-center text-sm">
        <span className={esVencido ? 'text-red-600 line-through' : 'text-slate-600'}>
          {producto.fechaCaducidad || '---'}
        </span>
        <div className="flex gap-2">
          <button onClick={alEditar} className="text-blue-600 font-semibold hover:text-blue-700">Editar</button>
          <button onClick={alEliminar} className="text-red-600 font-semibold hover:text-red-700">Eliminar</button>
        </div>
      </div>
    </div>
  );
}

export default TarjetaProducto;
