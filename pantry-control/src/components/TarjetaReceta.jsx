/**
 * TARJETA DE RECETA
 */
function TarjetaReceta(props) {
  let receta = props.receta;
  
  // Imagen
  let bloqueImagen = null;
  if (receta.imagen) {
    bloqueImagen = (
      <div className="h-40 w-full overflow-hidden border-b border-gray-300">
        <img 
          src={receta.imagen} 
          alt={receta.titulo} 
          className="w-full h-full object-cover" 
        />
      </div>
    );
  }

  // Tiempo
  let tiempo = receta.tiempo;
  if (!tiempo) {
    tiempo = '50 min';
  }

  return (
    <div className="overflow-hidden bg-white flex flex-col h-full border border-blue-200 rounded-lg">
      {bloqueImagen && (
        <div className="h-40 w-full overflow-hidden border-b border-blue-200">
          {bloqueImagen}
        </div>
      )}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-slate-800 mb-2">
          {receta.titulo}
        </h3>
        <p className="text-sm text-slate-600 mb-4 flex-grow">
          {tiempo} de preparación
        </p>
        <a href="#" className="text-blue-600 font-semibold hover:text-blue-700 text-sm">
          Ver receta
        </a>
      </div>
    </div>
  );
}

export default TarjetaReceta;
