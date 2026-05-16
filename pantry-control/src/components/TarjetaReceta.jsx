
function TarjetaReceta({ receta }) {
  const tiempo = receta.tiempo || '50 min';

  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 overflow-hidden shadow-sm rounded-xl">
      {/* Contenedor de Imagen  */}
      {receta.imagen && (
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
          <img
            src={receta.imagen}
            alt={receta.titulo}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 shadow-sm border border-gray-200 rounded-md">
            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-800">{tiempo}</span>
          </div>
        </div>
      )}

      <div className="p-4 flex flex-col items-center text-center flex-grow justify-center">
        <h3 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2">
          {receta.titulo}
        </h3>
      </div>
    </div>
  );
}

export default TarjetaReceta;